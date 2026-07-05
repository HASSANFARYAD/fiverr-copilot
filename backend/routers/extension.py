"""Endpoints for the browser extension content script.

These accept raw message text (no DB persistence needed for the quick workflow)
and return classification / reply drafts directly.
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/extension", tags=["extension"])


class ClassifyRequest(BaseModel):
    message: str


class ClassifyResponse(BaseModel):
    intent_label: str
    confidence: float


class ReplyDraftRequest(BaseModel):
    message: str
    tone: str = "professional"


class ReplyDraftResponse(BaseModel):
    content: str
    confidence: float


@router.post("/classify", response_model=ClassifyResponse)
async def classify_message(body: ClassifyRequest):
    from ..services.ai import classify_intent
    intent, confidence = await classify_intent([body.message])
    return ClassifyResponse(intent_label=intent, confidence=confidence)


@router.post("/reply-draft", response_model=ReplyDraftResponse)
async def generate_reply(body: ReplyDraftRequest):
    from ..services.ai import generate_reply
    content = await generate_reply([body.message], tone=body.tone)
    return ReplyDraftResponse(content=content, confidence=0.87)
