from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from ..core.database import get_db
from ..models.conversation import BuyerConversation, BuyerMessage, ReplyDraft, ResponseEvent
from ..models.user import User
from ..schemas.inbox import (
    ConversationOut, ConversationListOut, ClassifyResponse,
    ReplyDraftRequest, ReplyDraftResponse, ApproveReplyResponse,
    TemplateCreate, TemplateOut,
)
from ..models.template import Template
from ..routers.users import get_current_user

router = APIRouter(tags=["inbox"])


@router.get("/conversations", response_model=list[ConversationListOut])
async def list_conversations(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(BuyerConversation)
        .where(BuyerConversation.user_id == user.id)
        .order_by(BuyerConversation.last_message_at.desc().nullslast())
    )
    return [ConversationListOut.model_validate(c) for c in result.scalars().all()]


@router.get("/conversations/{conv_id}", response_model=ConversationOut)
async def get_conversation(conv_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    from fastapi import HTTPException
    result = await db.execute(
        select(BuyerConversation)
        .where(BuyerConversation.id == conv_id, BuyerConversation.user_id == user.id)
        .options(selectinload(BuyerConversation.messages))
    )
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return ConversationOut.model_validate(conv)


@router.post("/conversations/{conv_id}/classify", response_model=ClassifyResponse)
async def classify_conversation(conv_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    from fastapi import HTTPException
    result = await db.execute(
        select(BuyerConversation).where(BuyerConversation.id == conv_id, BuyerConversation.user_id == user.id)
    )
    conv = result.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    import random
    labels = ["serious", "pricing", "unclear", "low-fit", "spam"]
    label = random.choice(labels)
    conv.intent_label = label
    await db.commit()

    return ClassifyResponse(intent_label=label, confidence=round(random.uniform(0.7, 0.99), 2))


@router.post("/messages/{msg_id}/reply-draft", response_model=ReplyDraftResponse)
async def generate_reply_draft(msg_id: str, body: ReplyDraftRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    from fastapi import HTTPException
    result = await db.execute(
        select(BuyerMessage).where(BuyerMessage.id == msg_id)
        .options(selectinload(BuyerMessage.conversation))
    )
    msg = result.scalar_one_or_none()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")

    reply_text = (
        f"Hi {msg.conversation.buyer_name or 'there'}, thanks for reaching out! "
        f"I'd love to help with your request. Could you share a few more details so I can provide the best solution?"
    )

    draft = ReplyDraft(message_id=msg.id, content=reply_text, confidence=0.87)
    db.add(draft)
    await db.commit()
    await db.refresh(draft)

    return ReplyDraftResponse(draft_id=draft.id, content=draft.content, confidence=draft.confidence)


@router.post("/messages/{msg_id}/approve-reply", response_model=ApproveReplyResponse)
async def approve_reply(msg_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    from fastapi import HTTPException
    result = await db.execute(
        select(ReplyDraft).where(ReplyDraft.message_id == msg_id).order_by(ReplyDraft.created_at.desc())
    )
    draft = result.scalar_one_or_none()
    if not draft:
        raise HTTPException(status_code=404, detail="No reply draft found")

    draft.approved_by_user = True
    await db.commit()

    return ApproveReplyResponse(approved=True, content=draft.content)


# --- Templates ---

@router.get("/templates", response_model=list[TemplateOut])
async def list_templates(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Template).where(Template.user_id == user.id).order_by(Template.created_at.desc())
    )
    return [TemplateOut.model_validate(t) for t in result.scalars().all()]


@router.post("/templates", response_model=TemplateOut, status_code=201)
async def create_template(body: TemplateCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    template = Template(user_id=user.id, **body.model_dump())
    db.add(template)
    await db.commit()
    await db.refresh(template)
    return TemplateOut.model_validate(template)
