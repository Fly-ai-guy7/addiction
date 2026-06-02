from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agents.sales import sales_app, SalesState
from langchain_core.messages import HumanMessage
import uuid

router = APIRouter()

# In-memory store for workflow threads (POC)
# In prod, use LangGraph CheckpointSaver with Postgres
workflow_store = {}

class WorkflowStartRequest(BaseModel):
    lead_name: str
    company: str

class WorkflowActionRequest(BaseModel):
    workflow_id: str
    action: str # approve, reject

@router.post("/start")
async def start_sales_workflow(request: WorkflowStartRequest):
    workflow_id = str(uuid.uuid4())
    
    initial_state = SalesState(
        messages=[HumanMessage(content=f"Research {request.lead_name} at {request.company}")],
        lead_name=request.lead_name,
        company=request.company,
        email_draft="",
        status="processing"
    )
    
    # Run until the first interruption (mocking the interrupt logic manually for this MVP API)
    # Ideally LangGraph 'stream' with interrupt_before config
    
    # For MVP simplicity: We run the first two nodes manually or use a custom runner
    # Let's simulate: Research -> Draft -> STOP
    
    # Step 1: Research
    # Input for research node is the state
    res_update = sales_app.nodes["research"].invoke(initial_state, config={})
    # Update state
    current_state = {**initial_state, **res_update}
    current_state["messages"] = [*initial_state["messages"], *res_update["messages"]]
    
    # Step 2: Draft
    draft_update = sales_app.nodes["draft"].invoke(current_state, config={})
    current_state = {**current_state, **draft_update}
    current_state["messages"] = [*current_state["messages"], *draft_update["messages"]]
    
    # Store state
    workflow_store[workflow_id] = current_state
    
    return {
        "workflow_id": workflow_id,
        "status": current_state["status"],
        "draft": current_state["email_draft"]
    }

from app.api.deps_rbac import require_manager, get_db
from app.models.core import User
from app.models.audit import AuditLog
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

@router.post("/approve")
async def approve_workflow(
    request: WorkflowActionRequest,
    user: User = Depends(require_manager),
    db: AsyncSession = Depends(get_db)
):
    if request.workflow_id not in workflow_store:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    state = workflow_store[request.workflow_id]
    
    # Audit Log
    audit = AuditLog(
        user_id=user.id,
        action=f"workflow_{request.action}",
        resource_type="workflow",
        resource_id=request.workflow_id,
        details={"state_before": state["status"]},
        ip_address="127.0.0.1"
    )
    db.add(audit)
    await db.commit()

    if request.action == "reject":
        state["status"] = "rejected"
        return {"status": "rejected"}
        
    # Step 3: Send
    send_update = sales_app.nodes["send"].invoke(state, config={})
    state = {**state, **send_update}
    state["messages"] = [*state["messages"], *send_update["messages"]]
    
    workflow_store[request.workflow_id] = state
    
    return {
        "workflow_id": request.workflow_id,
        "status": state["status"]
    }

@router.get("/{workflow_id}")
async def get_workflow(workflow_id: str):
    if workflow_id not in workflow_store:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow_store[workflow_id]
