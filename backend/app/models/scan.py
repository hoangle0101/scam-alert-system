from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    scan_type = Column(String(20), nullable=False) # "url", "message", "file"
    input_value = Column(String(2000), nullable=False)
    verdict = Column(String(20), nullable=False) # "phishing", "suspicious", "legitimate"
    risk_level = Column(String(20), nullable=False) # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    confidence = Column(Float, nullable=False)
    processing_time_ms = Column(Float, nullable=True)
    model_version = Column(String(50), nullable=True)
    analysis_details = Column(JSON, nullable=True)
    is_false_positive = Column(Boolean, default=False) # CỘT MỚI THÊM
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="scans")
