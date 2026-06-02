from fastapi import APIRouter, Depends
from typing import List, Dict
import random
from app.api import deps

router = APIRouter()

@router.get("/stats")
async def get_stats(
    period: str = "24h",
    # current_user: dict = Depends(deps.get_current_active_user)
):
    # Mock data for MVP
    # in production: query SELECT count(*) FROM messages WHERE ...
    return {
        "total_requests": 1420,
        "total_tokens": 450000,
        "total_cost": 12.50,
        "avg_latency_ms": 350,
        "errors": 5,
        "active_users": 12
    }

@router.get("/activity")
async def get_activity_series():
    # Mock time-series data for chart
    return [
        {"time": "00:00", "requests": 12},
        {"time": "04:00", "requests": 5},
        {"time": "08:00", "requests": 45},
        {"time": "12:00", "requests": 120},
        {"time": "16:00", "requests": 90},
        {"time": "20:00", "requests": 35},
    ]
