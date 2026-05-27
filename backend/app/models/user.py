"""
User and Family Shield ORM models.
"""

from datetime import datetime, timezone

from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, Text,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="user")  # "user" | "admin"
    is_active = Column(Boolean, default=True)
    phone = Column(String(20), nullable=True)
    avatar_url = Column(Text, nullable=True)
    notify_push = Column(Boolean, default=True)
    notify_email = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    scans = relationship("ScanResult", back_populates="user", lazy="dynamic")
    posts = relationship("CommunityPost", back_populates="author", lazy="dynamic")
    guardians = relationship(
        "FamilyLink",
        foreign_keys="FamilyLink.protected_id",
        back_populates="protected_user",
    )
    protected_members = relationship(
        "FamilyLink",
        foreign_keys="FamilyLink.guardian_id",
        back_populates="guardian_user",
    )

    def __repr__(self) -> str:
        return f"<User {self.email} role={self.role}>"


class FamilyLink(Base):
    """Family Shield: links a guardian (protector) to a protected member."""
    __tablename__ = "family_links"

    id = Column(Integer, primary_key=True, index=True)
    guardian_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    protected_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default="active")  # "active" | "pending"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    guardian_user = relationship("User", foreign_keys=[guardian_id])
    protected_user = relationship("User", foreign_keys=[protected_id])
