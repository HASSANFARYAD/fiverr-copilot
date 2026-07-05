import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from ..core.database import get_db
from ..models.gig import GigDraft, GigKeyword, GigPackage, GigFAQ
from ..models.user import User
from ..schemas.gig import (
    GigDraftCreate, GigDraftOut, GigDraftUpdate,
    GigScoreResponse, ChecklistItem,
)
from ..routers.users import get_current_user

router = APIRouter(prefix="/gigs", tags=["gigs"])


@router.post("/draft", response_model=GigDraftOut, status_code=201)
async def create_draft(body: GigDraftCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    draft = GigDraft(user_id=user.id, niche=body.niche, status="draft")
    db.add(draft)
    await db.commit()
    await db.refresh(draft)

    keywords_list = [k.strip() for k in body.keywords.split(",") if k.strip()]
    for kw in keywords_list:
        db.add(GigKeyword(gig_draft_id=draft.id, keyword=kw, type="secondary", priority=50))

    for pkg_data in [
        {"tier": "Basic", "price": 30.00, "delivery_days": 3, "features": ["Single page", "Responsive design"]},
        {"tier": "Standard", "price": 60.00, "delivery_days": 5, "features": ["Up to 5 pages", "API integration"]},
        {"tier": "Premium", "price": 120.00, "delivery_days": 10, "features": ["Full-stack", "Deployment", "30 days support"]},
    ]:
        db.add(GigPackage(gig_draft_id=draft.id, **pkg_data))

    await db.commit()

    result = await db.execute(
        select(GigDraft)
        .where(GigDraft.id == draft.id)
        .options(selectinload(GigDraft.keywords), selectinload(GigDraft.packages), selectinload(GigDraft.faqs))
    )
    return GigDraftOut.model_validate(result.scalar_one())


@router.get("", response_model=list[GigDraftOut])
async def list_drafts(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(GigDraft)
        .where(GigDraft.user_id == user.id)
        .options(selectinload(GigDraft.keywords), selectinload(GigDraft.packages), selectinload(GigDraft.faqs))
        .order_by(GigDraft.created_at.desc())
    )
    return [GigDraftOut.model_validate(d) for d in result.scalars().all()]


@router.get("/{draft_id}", response_model=GigDraftOut)
async def get_draft(draft_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(GigDraft)
        .where(GigDraft.id == draft_id, GigDraft.user_id == user.id)
        .options(selectinload(GigDraft.keywords), selectinload(GigDraft.packages), selectinload(GigDraft.faqs))
    )
    draft = result.scalar_one_or_none()
    if not draft:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Gig draft not found")
    return GigDraftOut.model_validate(draft)


@router.patch("/{draft_id}", response_model=GigDraftOut)
async def update_draft(draft_id: str, body: GigDraftUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    from fastapi import HTTPException
    result = await db.execute(
        select(GigDraft).where(GigDraft.id == draft_id, GigDraft.user_id == user.id)
    )
    draft = result.scalar_one_or_none()
    if not draft:
        raise HTTPException(status_code=404, detail="Gig draft not found")

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(draft, field, value)
    await db.commit()

    result = await db.execute(
        select(GigDraft)
        .where(GigDraft.id == draft.id)
        .options(selectinload(GigDraft.keywords), selectinload(GigDraft.packages), selectinload(GigDraft.faqs))
    )
    return GigDraftOut.model_validate(result.scalar_one())


@router.post("/{draft_id}/score", response_model=GigScoreResponse)
async def score_draft(draft_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    from fastapi import HTTPException
    result = await db.execute(
        select(GigDraft).where(GigDraft.id == draft_id, GigDraft.user_id == user.id)
        .options(selectinload(GigDraft.keywords), selectinload(GigDraft.packages), selectinload(GigDraft.faqs))
    )
    draft = result.scalar_one_or_none()
    if not draft:
        raise HTTPException(status_code=404, detail="Gig draft not found")

    checklist = [
        ChecklistItem(label="Title contains primary keyword", done=bool(draft.title and draft.keywords)),
        ChecklistItem(label="Description has intro section", done=bool(draft.description)),
        ChecklistItem(label="Package tiers active", done=len(draft.packages) >= 2),
        ChecklistItem(label="All 5 tags filled", done=len(draft.keywords) >= 5),
        ChecklistItem(label="FAQs generated", done=len(draft.faqs) > 0),
    ]
    score = round(sum(1 for c in checklist if c.done) / len(checklist) * 100)
    draft.score = score
    await db.commit()

    return GigScoreResponse(score=score, checklist=checklist)


@router.post("/{draft_id}/publish-checklist", response_model=GigScoreResponse)
async def publish_checklist(draft_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await score_draft(draft_id, user, db)
