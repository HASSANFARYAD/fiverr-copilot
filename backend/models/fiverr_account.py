import uuid
from datetime import datetime, timezone

from sqlalchemy import String, DateTime, ForeignKey, Column
from sqlalchemy.orm import relationship

from ..core.database import Base


class FiverrAccount(Base):
    __tablename__ = "fiverr_accounts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    username = Column(String, nullable=False)
    auth_status = Column(String, default="pending")
    connected_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="fiverr_accounts")
