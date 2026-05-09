"""
ORM models for Scam Reports and False Positive Appeals.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base

class ScamReport(Base):
    __tablename__ = "scam_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_type = Column(String(50), nullable=False) # url, phone, email, crypto
    target_value = Column(String(1000), nullable=False)
    scam_category = Column(String(100), nullable=False) # phishing, impersonation, etc.
    description = Column(Text, nullable=True)
    evidence_url = Column(String(1000), nullable=True)
    status = Column(String(50), default="pending") # pending, investigating, approved, rejected
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", backref="scam_reports")

class FalsePositiveAppeal(Base):
    __tablename__ = "false_positive_appeals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scan_result_id = Column(Integer, ForeignKey("scan_results.id"), nullable=True)
    target_url = Column(String(1000), nullable=False) # The URL that was falsely flagged
    reason = Column(Text, nullable=False)
    evidence_url = Column(String(1000), nullable=True)
    status = Column(String(50), default="pending") # pending, reviewing, resolved, rejected
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", backref="appeals")
    scan_result = relationship("ScanResult")
