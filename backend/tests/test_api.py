import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

@pytest.mark.asyncio
async def test_analytics_endpoints(client: AsyncClient):
    response = await client.get("/api/v1/analytics/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_requests" in data
    assert "total_cost" in data

@pytest.mark.asyncio
async def test_chat_creation_validation(client: AsyncClient):
    # Test invalid payload (missing message)
    payload = {"model": "gpt-3.5-turbo"}
    headers = {"Authorization": "Bearer mock-token"}
    response = await client.post("/api/v1/chat/send", json=payload, headers=headers)
    assert response.status_code == 422
