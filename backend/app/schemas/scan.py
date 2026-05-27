"""
Scan request/response schemas.
"""

from datetime import datetime
from pydantic import BaseModel, Field


class URLScanRequest(BaseModel):
    url: str = Field(..., min_length=5, max_length=2048, examples=["https://vietcombank-verify.online/login"])


class MessageScanRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)


class ScanResultResponse(BaseModel):
    id: int | None = None
    scan_type: str
    input_value: str
    verdict: str            # "phishing" | "legitimate" | "suspicious"
    confidence: float       # 0.0 – 1.0
    risk_level: str         # "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE"
    analysis_details: dict | None = None
    model_version: str
    processing_time_ms: float | None = None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}


class ScanHistoryResponse(BaseModel):
    total: int
    page: int
    per_page: int
    results: list[ScanResultResponse]
