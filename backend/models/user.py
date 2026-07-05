import uuid
from datetime import datetime, timezone

from sqlalchemy import String, DateTime, JSON, Column
from sqlalchemy.orm import relationship

from ..core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=True)
    timezone = Column(String, default="UTC")
    tone = Column(String, default="professional")
    business_hours = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    fiverr_accounts = relationship("FiverrAccount", back_populates="user", cascade="all, delete-orphan")
    gig_drafts = relationship("GigDraft", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("BuyerConversation", back_populates="user", cascade="all, delete-orphan")
    templates = relationship("Template", back_populates="user", cascade="all, delete-orphan")
