import uuid

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_db
from ..models.user import User
from ..schemas.user import UserOut, UserUpdate

router = APIRouter(tags=["users"])

DEMO_USER_ID = str(uuid.uuid4())


async def get_current_user(db: AsyncSession = Depends(get_db)) -> User:
    result = await db.execute(select(User).where(User.email == "demo@example.com"))
    user = result.scalar_one_or_none()
    if not user:
        user = User(
            id=DEMO_USER_ID,
            email="demo@example.com",
            name="Demo User",
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user


@router.get("/me", response_model=UserOut)
async def get_me(user: User = Depends(get_current_user)):
    return UserOut.model_validate(user)


@router.patch("/me", response_model=UserOut)
async def update_me(body: UserUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    await db.commit()
    await db.refresh(user)
    return UserOut.model_validate(user)
