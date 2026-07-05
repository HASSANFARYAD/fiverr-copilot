import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Text, Boolean, Integer, DateTime, ForeignKey, Float, Column
from sqlalchemy.orm import relationship

from ..core.database import Base


class BuyerConversation(Base):
    __tablename__ = "buyer_conversations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    platform_thread_id = Column(String, nullable=True)
    buyer_name = Column(String, nullable=True)
    status = Column(String, default="active")
    intent_label = Column(String, nullable=True)
    last_message_at = Column(DateTime(timezone=True), nullable=True)
    response_deadline_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="conversations")
    messages = relationship("BuyerMessage", back_populates="conversation", cascade="all, delete-orphan")
    response_events = relationship("ResponseEvent", back_populates="conversation", cascade="all, delete-orphan")


class BuyerMessage(Base):
    __tablename__ = "buyer_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String(36), ForeignKey("buyer_conversations.id", ondelete="CASCADE"), nullable=False)
    sender_type = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    intent_label = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    conversation = relationship("BuyerConversation", back_populates="messages")
    reply_drafts = relationship("ReplyDraft", back_populates="message", cascade="all, delete-orphan")


class ReplyDraft(Base):
    __tablename__ = "reply_drafts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    message_id = Column(String(36), ForeignKey("buyer_messages.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    confidence = Column(Float, default=0.0)
    approved_by_user = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    message = relationship("BuyerMessage", back_populates="reply_drafts")


class ResponseEvent(Base):
    __tablename__ = "response_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = Column(String(36), ForeignKey("buyer_conversations.id", ondelete="CASCADE"), nullable=False)
    replied_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    response_time_minutes = Column(Integer, nullable=True)

    conversation = relationship("BuyerConversation", back_populates="response_events")
