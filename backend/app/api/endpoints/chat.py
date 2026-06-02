from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.api import deps

# Simple schemas for MVP
class MessageCreate(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[MessageCreate]] = []
    model: str = "gpt-3.5-turbo"
    mode: str = "standard" # standard, corporate

class ChatResponse(BaseModel):
    response: str
    model_used: str

router = APIRouter()

@router.post("/send", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    current_user: dict = Depends(deps.get_current_active_user)
):
    try:
        # Construct messages list for LangGraph
        from langchain_core.messages import HumanMessage, AIMessage
        
        graph_messages = []
        for m in request.history:
            if m.role == "user":
                graph_messages.append(HumanMessage(content=m.content))
            else:
                graph_messages.append(AIMessage(content=m.content))
        
        graph_messages.append(HumanMessage(content=request.message))

        # Select Agent Mode
        if request.mode == "corporate":
            from app.agents.corporate import app as agent_app
            model_name = "agent-corporate-gpt-4"
        else:
            from app.agents.graph import app as agent_app
            model_name = "agent-standard-gpt-3.5"
        
        # Run the graph
        inputs = {"messages": graph_messages}
        result = await agent_app.ainvoke(inputs)
        
        # Extract final message content
        final_messages = result["messages"]
        last_message = final_messages[-1]
        content = last_message.content
        
        return {
            "response": content,
            "model_used": model_name
        }
    except Exception as e:
        print(f"Agent Error: {e}")
        # Return error as message for better UX
        return {
            "response": f"I encountered an error: {str(e)}",
            "model_used": "error"
        }
