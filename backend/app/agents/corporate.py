from typing import Annotated, Any, Dict, List, Optional, Sequence, TypedDict
import operator
import functools

from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, FunctionMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers.openai_functions import JsonOutputFunctionsParser
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode

from app.agents.tools import (
    calculator, 
    web_search, 
    wikipedia_search, 
    arxiv_search, 
    python_interpreter,
    generate_image,
    rag_search
)
from app.core.config import settings

# --- State Definition ---
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    next: str

# --- Helper to create agents ---
def create_agent(llm, tools, system_message: str):
    """Helper to create an agent node."""
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_message),
        MessagesPlaceholder(variable_name="messages"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])
    if tools:
        llm_with_tools = llm.bind_tools(tools)
    else:
        llm_with_tools = llm
    return prompt | llm_with_tools

# --- Models ---
llm = ChatOpenAI(model="gpt-4-turbo", api_key=settings.OPENAI_API_KEY)

# --- Define Agents (Elite Team) ---

# 1. Chief Technology Officer (Engineering & IT)
it_agent = create_agent(
    llm, 
    [python_interpreter, web_search, arxiv_search], 
    "You are a World-Class CTO and Distinguised Engineer. You possess deep expertise in "
    "distributed systems, AI architecture, and secure coding practices. "
    "When asked to write code, produce production-grade, optimized, and documented Python code. "
    "When asked for research, find the most cutting-edge papers on Arxiv."
)

# 2. Chief Marketing Officer (Marketing)
marketing_agent = create_agent(
    llm, 
    [web_search, generate_image, wikipedia_search], 
    "You are a Visionary CMO with a track record of viral global campaigns. "
    "You think in bold, creative metaphors and strategic positioning. "
    "Use image generation to create stunning visual concepts that capture the brand's essence. "
    "Analyze market trends to find the 'Blue Ocean' opportunity."
)

# 3. Head of Sales (Global Revenue)
sales_agent = create_agent(
    llm, 
    [web_search, calculator], 
    "You are an Elite VP of Sales, known for closing Fortune 500 deals. "
    "Focus on high-value enterprise strategy, accurate revenue forecasting, and persuasive communication. "
    "Use data to back up your pitch. Always think about ROI and the bottom line."
)

# 4. Social Media Director (Viral Growth)
social_agent = create_agent(
    llm, 
    [web_search, generate_image, wikipedia_search], 
    "You are a Social Media Maven and Trendsetter. You know exactly what makes content go viral. "
    "Craft tweets, posts, and captions that are witty, engaging, and shareable. "
    "Use emojis strategically. Understand the nuances of each platform (LinkedIn vs TikTok)."
)

# 5. Chief People Officer (HR & Culture)
hr_agent = create_agent(
    llm, 
    [web_search, rag_search], 
    "You are a Chief People Officer dedicated to building a world-class culture. "
    "You balance empathy with compliance. When drafting policies, ensure they are fair, inclusive, and legal. "
    "When handling personnel issues, be professional, discreet, and solution-oriented."
)

# 6. Chief Product Officer (Product)
product_agent = create_agent(
    llm, 
    [web_search, generate_image, wikipedia_search], 
    "You are the Chief Product Officer (CPO). You define the product vision, roadmap, and requirements. "
    "Bridge the gap between Marketing's dreams and Engineering's reality. "
    "For physical products like cars, specify materials, dimensions, and features."
)

# --- Node Functions ---

async def it_node(state):
    result = await it_agent.ainvoke(state)
    return {"messages": [result]}

async def marketing_node(state):
    result = await marketing_agent.ainvoke(state)
    return {"messages": [result]}

async def sales_node(state):
    result = await sales_agent.ainvoke(state)
    return {"messages": [result]}

async def social_node(state):
    result = await social_agent.ainvoke(state)
    return {"messages": [result]}

async def hr_node(state):
    result = await hr_agent.ainvoke(state)
    return {"messages": [result]}

async def product_node(state):
    result = await product_agent.ainvoke(state)
    return {"messages": [result]}

# --- Supervisor ---

members = ["IT", "Marketing", "Sales", "SocialMedia", "HR", "Product"]
system_prompt = (
    "You are the CEO of a tech company. You have the following departments:"
    " {members}. Given the user's request, decide which department should act next."
    " Each department will perform a task and return results."
    " When the entire request is satisfied, respond with FINISH."
)

options = ["FINISH"] + members
function_def = {
    "name": "route",
    "description": "Select the next department.",
    "parameters": {
        "title": "routeSchema",
        "type": "object",
        "properties": {
            "next": {
                "title": "Next",
                "anyOf": [
                    {"enum": options},
                ],
            }
        },
        "required": ["next"],
    },
}

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    MessagesPlaceholder(variable_name="messages"),
    (
        "system",
        "Given the conversation above, who should act next?"
        " Or should we FINISH? Select one of: {options}",
    ),
]).partial(options=str(options), members=", ".join(members))

supervisor_chain = (
    prompt 
    | llm.bind_functions(functions=[function_def], function_call="route") 
    | JsonOutputFunctionsParser()
)

async def supervisor_node(state):
    result = await supervisor_chain.ainvoke(state)
    return result

# --- Build Graph ---

workflow = StateGraph(AgentState)

workflow.add_node("Supervisor", supervisor_node)
workflow.add_node("IT", it_node)
workflow.add_node("Marketing", marketing_node)
workflow.add_node("Sales", sales_node)
workflow.add_node("SocialMedia", social_node)
workflow.add_node("HR", hr_node)
workflow.add_node("Product", product_node)

for member in members:
    workflow.add_edge(member, "Supervisor")

workflow.set_entry_point("Supervisor")

workflow.add_conditional_edges(
    "Supervisor",
    lambda x: x["next"],
    {
        "IT": "IT",
        "Marketing": "Marketing",
        "Sales": "Sales",
        "SocialMedia": "SocialMedia",
        "HR": "HR",
        "Product": "Product",
        "FINISH": END
    }
)

app = workflow.compile()
