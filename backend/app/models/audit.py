"""
Audit Log ORM model — tracks all system events for admin monitoring.
"""

from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime, Text, JSON

from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String(100), nullable=False)   # "scan.url" | "auth.login" | "admin.ban_user"
    resource = Column(String(100), nullable=True)  # "scan_result" | "user" | "community_post"
    resource_id = Column(Integer, nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    status = Column(String(20), default="success")  # "success" | "failure"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
