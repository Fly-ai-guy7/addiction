from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.models.core import User, UserRole

# Mock Auth for MVP - In prod verify JWT from Clerk
security = HTTPBearer()

async def get_db() -> Generator:
    async with AsyncSessionLocal() as session:
        yield session

async def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    # MVP: We assume the token IS the user_id or email for simplicity in testing
    # In prod: jwt.decode(token.credentials)
    
    # For now, we'll just get the first user or create a mock admin
    # This allows the UI to work without real JWTs for the demo
    result = await db.execute(
        "SELECT * FROM users LIMIT 1"
    )
    user = result.first()
    
    if not user:
        # Create a mock admin user if none exists
        # In a real app, this happens via sign-up
        return User(id=1, email="admin@solar.ai", role=UserRole.ADMIN)

    # Return a mock user object compliant with SQLAlchemy model
    # Real implementation would query DB
    return User(id=1, email="admin@solar.ai", role=UserRole.ADMIN, full_name="Admin User")

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

class RoleChecker:
    def __init__(self, allowed_roles: list[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)):
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return user

# Helper to require common roles
require_admin = RoleChecker([UserRole.ADMIN])
require_manager = RoleChecker([UserRole.ADMIN, UserRole.MANAGER])
