from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class GigKeywordOut(BaseModel):
    id: UUID
    keyword: str
    type: str | None = None
    priority: int

    class Config:
        from_attributes = True


class GigPackageOut(BaseModel):
    id: UUID
    tier: str
    price: float | None = None
    delivery_days: int | None = None
    features: list[str] | None = None

    class Config:
        from_attributes = True


class GigFAQOut(BaseModel):
    id: UUID
    question: str
    answer: str

    class Config:
        from_attributes = True


class GigDraftOut(BaseModel):
    id: UUID
    niche: str | None = None
    title: str | None = None
    description: str | None = None
    status: str
    score: int | None = None
    created_at: datetime
    updated_at: datetime
    keywords: list[GigKeywordOut] = []
    packages: list[GigPackageOut] = []
    faqs: list[GigFAQOut] = []

    class Config:
        from_attributes = True


class GigDraftCreate(BaseModel):
    niche: str
    keywords: str = ""
    tone: str = "professional"


class GigDraftUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: str | None = None


class KeywordSuggestRequest(BaseModel):
    niche: str
    existing_keywords: list[str] = []


class KeywordSuggestResponse(BaseModel):
    primary: list[dict]
    secondary: list[dict]
    long_tail: list[dict]


class PackageGenerateRequest(BaseModel):
    niche: str
    title: str
    description: str


class PackageGenerateResponse(BaseModel):
    packages: list[dict]


class FAQGenerateRequest(BaseModel):
    niche: str
    title: str
    description: str


class FAQGenerateResponse(BaseModel):
    faqs: list[dict]


class ChecklistItem(BaseModel):
    label: str
    done: bool


class GigScoreResponse(BaseModel):
    score: int
    checklist: list[ChecklistItem]
