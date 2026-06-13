from fastapi import Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
# JWT + API key auth injected here
# Returns current user + org context to every route

async def get_current_user(authorization: str = Header(...), db: AsyncSession = Depends(get_db)):
    # Validate Supabase JWT → load user from DB
    raise NotImplementedError("Implement JWT validation")

async def get_current_org(user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Load org for user
    raise NotImplementedError
