from typing import Optional, Dict, Any
import httpx
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

# Clerk JWKS URL (Public keys)
CLERK_JWKS_URL = "https://api.clerk.com/v1/jwks"

security = HTTPBearer()

async def get_current_user_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    if not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid authentication credentials",
        )
    return credentials.credentials

async def verify_token(token: str) -> Dict[str, Any]:
    # TODO: Implement real JWT verification with Clerk's JWKS.
    # For MVP/Development without a real Clerk key, we might mock this or implement loosely.
    # If production keys are present, we should verify signature.
    
    if not settings.CLERK_SECRET_KEY:
        # Development bypass if no keys set (WARN: NOT SECURE)
        # This allows you to test without full Clerk setup if needed
        return {"sub": "user_mock", "email": "mock@example.com"}

    try:
        # In a real impl, use python-jose or jwt to verify against JWKS
        # For now, we'll assume the token is passed to Clerk or Verified by the Gateway
        pass
    except Exception as e:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    return {"sub": "user_mock"} # Placeholder
