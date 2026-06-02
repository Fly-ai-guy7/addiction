from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from app.core.config import settings

# Define State
class SalesState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    lead_name: str
    company: str
    email_draft: str
    status: str # processing, waiting_approval, completed

# Mock Tools for Sales
def research_lead(state: SalesState):
    lead = state["lead_name"]
    company = state["company"]
    # Mock research
    research = f"{lead} is the CTO of {company}. They recently raised Series B."
    return {"messages": [AIMessage(content=f"Research Result: {research}")]}

def draft_email(state: SalesState):
    # In reality, LLM generates this
    research_msg = state["messages"][-1].content
    draft = f"Subject: Congrats on Series B!\n\nHi {state['lead_name']},\n\nSaw news about {state['company']}. Would love to chat.\n\nBest,\nSolar Hypernova"
    return {
        "messages": [AIMessage(content=f"Drafted Email: {draft}")],
        "email_draft": draft,
        "status": "waiting_approval"
    }

def send_email(state: SalesState):
    # Mock sending
    print(f"SENDING EMAIL: {state['email_draft']}")
    return {
        "messages": [AIMessage(content="Email sent successfully!")],
        "status": "completed"
    }

# Define Graph
workflow = StateGraph(SalesState)

workflow.add_node("research", research_lead)
workflow.add_node("draft", draft_email)
workflow.add_node("send", send_email)

workflow.set_entry_point("research")
workflow.add_edge("research", "draft")
workflow.add_edge("draft", "send")
workflow.add_edge("send", END)

# Set breakpoint logic is handled by the runner in the API
# but we define the graph here.
sales_app = workflow.compile()
