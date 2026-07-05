import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, JSON, Numeric, Column
from sqlalchemy.orm import relationship

from ..core.database import Base


class GigDraft(Base):
    __tablename__ = "gig_drafts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    niche = Column(String, nullable=True)
    title = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="draft")
    score = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="gig_drafts")
    keywords = relationship("GigKeyword", back_populates="gig_draft", cascade="all, delete-orphan")
    packages = relationship("GigPackage", back_populates="gig_draft", cascade="all, delete-orphan")
    faqs = relationship("GigFAQ", back_populates="gig_draft", cascade="all, delete-orphan")


class GigKeyword(Base):
    __tablename__ = "gig_keywords"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    gig_draft_id = Column(String(36), ForeignKey("gig_drafts.id", ondelete="CASCADE"), nullable=False)
    keyword = Column(String, nullable=False)
    type = Column(String, nullable=True)
    priority = Column(Integer, default=0)

    gig_draft = relationship("GigDraft", back_populates="keywords")


class GigPackage(Base):
    __tablename__ = "gig_packages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    gig_draft_id = Column(String(36), ForeignKey("gig_drafts.id", ondelete="CASCADE"), nullable=False)
    tier = Column(String, nullable=False)
    price = Column(Numeric(10, 2), nullable=True)
    delivery_days = Column(Integer, nullable=True)
    features = Column(JSON, nullable=True)

    gig_draft = relationship("GigDraft", back_populates="packages")


class GigFAQ(Base):
    __tablename__ = "gig_faqs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    gig_draft_id = Column(String(36), ForeignKey("gig_drafts.id", ondelete="CASCADE"), nullable=False)
    question = Column(String, nullable=False)
    answer = Column(Text, nullable=False)

    gig_draft = relationship("GigDraft", back_populates="faqs")
