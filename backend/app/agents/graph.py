from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolExecutor, ToolInvocation, ToolNode
from app.agents.tools import (
    calculator,
    web_search,
    rag_search,
    generate_image,
    wikipedia_search,
    arxiv_search,
    python_interpreter
)
from app.core.config import settings

# Define the Agent State
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]

# Define Tools
tools = [
    calculator,
    web_search,
    rag_search,
    generate_image,
    wikipedia_search,
    arxiv_search,
    python_interpreter
]
# In LangGraph 0.1+, ToolNode is the standard way to run tools
tool_node = ToolNode(tools)

# Define the Model
# We bind tools to the model so it knows it can call them
model = ChatOpenAI(
    model="gpt-3.5-turbo", 
    api_key=settings.OPENAI_API_KEY or "mock-key",
    temperature=0
).bind_tools(tools)

# Define the Nodes
def call_model(state):
    messages = state["messages"]
    response = model.invoke(messages)
    return {"messages": [response]}

def should_continue(state):
    messages = state["messages"]
    last_message = messages[-1]
    # If there is no tool call, then we finish
    if not last_message.tool_calls:
        return "end"
    # Otherwise if there is, we continue to the tools
    return "continue"

# Define the Graph
workflow = StateGraph(AgentState)

workflow.add_node("agent", call_model)
workflow.add_node("action", tool_node)

workflow.set_entry_point("agent")

workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "continue": "action",
        "end": END
    }
)

workflow.add_edge("action", "agent")

# Compile
app = workflow.compile()
