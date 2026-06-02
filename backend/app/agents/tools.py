from langchain_community.tools import DuckDuckGoSearchRun, WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
from langchain_community.tools.arxiv.tool import ArxivQueryRun
from langchain_community.utilities import ArxivAPIWrapper
from langchain_experimental.utilities import PythonREPL
from langchain_core.tools import tool

# --- Calculator ---
@tool
def calculator(operation: str) -> str:
    """Useful for performing mathematical calculations. 
    The input should be a string representing the expression, e.g., '2 + 2'."""
    try:
        # Using numexpr is safer, but evals is fine for MVP agent if sandboxed
        return str(eval(operation))
    except Exception as e:
        return f"Error: {str(e)}"

# --- Web Search (DuckDuckGo) ---
@tool
def web_search(query: str) -> str:
    """Useful for searching the internet for current events or information not in your training data.
    Input should be a search query."""
    try:
        search = DuckDuckGoSearchRun()
        return search.run(query)
    except Exception as e:
        return f"Search Error: {str(e)}"

# --- Wikipedia ---
@tool
def wikipedia_search(query: str) -> str:
    """Useful for querying Wikipedia for general knowledge, history, and definitions.
    Input should be a search query."""
    try:
        api_wrapper = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=1000)
        tool = WikipediaQueryRun(api_wrapper=api_wrapper)
        return tool.run(query)
    except Exception as e:
        return f"Wikipedia Error: {str(e)}"

# --- Arxiv Research ---
@tool
def arxiv_search(query: str) -> str:
    """Useful for searching academic papers and scientific research on Arxiv.
    Input should be a search query."""
    try:
        api_wrapper = ArxivAPIWrapper(top_k_results=1, doc_content_chars_max=1000)
        tool = ArxivQueryRun(api_wrapper=api_wrapper)
        return tool.run(query)
    except Exception as e:
        return f"Arxiv Error: {str(e)}"

# --- Python Code Interpreter ---
@tool
def python_interpreter(code: str) -> str:
    """Useful for executing Python code to solve complex problems, data analysis, or generating visualizations.
    Input should be valid Python code. The code will optionally print output."""
    try:
        repl = PythonREPL()
        return repl.run(code)
    except Exception as e:
        return f"Execution Error: {str(e)}"

# --- RAG (Internal Docs) ---
@tool
def rag_search(query: str) -> str:
    """Useful for searching internal documentation and project files. 
    Use this when the user asks about specific uploaded documents."""
    # Placeholder for actual Vector DB lookup
    # In a real implementation, this would call embedding_model and query pgvector
    return f"Found relevant documents for: {query}. Context: [Document A section 1...]"

# --- Image Generation ---
@tool
def generate_image(prompt: str) -> str:
    """Useful for generating images based on a text description.
    Input should be a detailed prompt for the image."""
    # Mock Image Generation
    # In production, call OpenAI DALL-E 3
    # Returning a placeholder image URL
    return f"![Generated Image](https://via.placeholder.com/512x512?text={prompt.replace(' ', '+')})"
