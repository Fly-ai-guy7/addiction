from fastapi import APIRouter
from app.api.endpoints import chat, rag, analytics, workflows

api_router = APIRouter()
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(rag.router, prefix="/rag", tags=["rag"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(workflows.router, prefix="/workflows", tags=["workflows"])
