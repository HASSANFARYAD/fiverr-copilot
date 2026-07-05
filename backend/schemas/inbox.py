from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class BuyerMessageOut(BaseModel):
    id: UUID
    sender_type: str
    body: str
    intent_label: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class ReplyDraftOut(BaseModel):
    id: UUID
    content: str
    confidence: float
    approved_by_user: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationOut(BaseModel):
    id: UUID
    buyer_name: str | None = None
    status: str
    intent_label: str | None = None
    last_message_at: datetime | None = None
    response_deadline_at: datetime | None = None
    created_at: datetime
    messages: list[BuyerMessageOut] = []

    class Config:
        from_attributes = True


class ConversationListOut(BaseModel):
    id: UUID
    buyer_name: str | None = None
    status: str
    intent_label: str | None = None
    last_message_at: datetime | None = None
    response_deadline_at: datetime | None = None

    class Config:
        from_attributes = True


class ClassifyResponse(BaseModel):
    intent_label: str
    confidence: float


class ReplyDraftRequest(BaseModel):
    tone: str = "professional"


class ReplyDraftResponse(BaseModel):
    draft_id: UUID
    content: str
    confidence: float


class ApproveReplyResponse(BaseModel):
    approved: bool
    content: str


class TemplateCreate(BaseModel):
    type: str
    title: str
    body: str
    niche: str | None = None


class TemplateOut(BaseModel):
    id: UUID
    type: str
    title: str | None = None
    body: str
    niche: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
