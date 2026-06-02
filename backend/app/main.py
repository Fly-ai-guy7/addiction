from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Solar Hypernova API", version="0.1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "solar-hypernova-backend"}

@app.get("/")
async def root():
    return {"message": "Welcome to Solar Hypernova API"}

from app.api.api import api_router
app.include_router(api_router, prefix="/api/v1")
