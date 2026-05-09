from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.core.database import get_db
from app.services.scan_service import ScanService
from app.models.scan import ScanResult
from pydantic import BaseModel

router = APIRouter(prefix="/scan", tags=["Scanner"])

# Dùng Class này để hứng dữ liệu
class URLScanRequest(BaseModel):
    url: str

class MessageScanRequest(BaseModel):
    content: str

@router.post("/url")
async def scan_url(
    data: URLScanRequest, 
    db: Session = Depends(get_db)
):
    """
    Endpoint quét URL
    """
    try:
        # In log ra terminal để chắc chắn request đã tới
        print(f"\n[DEBUG] RECEIVED SCAN REQUEST FOR: {data.url}")
        
        result = await ScanService.scan_url(db, data.url, None)
        return result
    except Exception as e:
        import traceback
        print("\n[ERROR] EXCEPTION IN SCAN ROUTE:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/message")
async def scan_message(
    data: MessageScanRequest, 
    db: Session = Depends(get_db)
):
    """
    Endpoint quét Tin nhắn / Email (AI Text Analysis)
    """
    try:
        print(f"\n[DEBUG] RECEIVED TEXT SCAN REQUEST: {data.content[:50]}...")
        result = await ScanService.scan_message(db, data.content, None)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_scan_history(page: int = 1, limit: int = 20, db: Session = Depends(get_db)):
    """
    Lấy lịch sử quét từ database, có phân trang
    """
    offset = (page - 1) * limit
    results = db.query(ScanResult).order_by(desc(ScanResult.created_at)).offset(offset).limit(limit).all()
    total = db.query(func.count(ScanResult.id)).scalar()
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "results": [
            {
                "id": r.id,
                "scan_type": r.scan_type,
                "input_value": r.input_value,
                "verdict": r.verdict,
                "risk_level": r.risk_level,
                "confidence": r.confidence,
                "created_at": r.created_at.isoformat() if r.created_at else None
            } for r in results
        ]
    }

@router.get("/stats")
async def get_scan_stats(db: Session = Depends(get_db)):
    """
    Tính toán các chỉ số thống kê tổng quan
    """
    total_scans = db.query(func.count(ScanResult.id)).scalar() or 0
    phishing_scans = db.query(func.count(ScanResult.id)).filter(ScanResult.verdict == "phishing").scalar() or 0
    suspicious_scans = db.query(func.count(ScanResult.id)).filter(ScanResult.verdict == "suspicious").scalar() or 0
    safe_scans = db.query(func.count(ScanResult.id)).filter(ScanResult.verdict.in_(["legitimate", "safe"])).scalar() or 0
    
    # Tính trung bình thời gian phản hồi (chỉ tính những dòng có giá trị hợp lệ)
    avg_latency = db.query(func.avg(ScanResult.processing_time_ms)).filter(ScanResult.processing_time_ms > 0).scalar() or 0.0

    return {
        "total_scans": total_scans,
        "phishing_scans": phishing_scans,
        "suspicious_scans": suspicious_scans,
        "safe_scans": safe_scans,
        "avg_latency_ms": round(avg_latency, 2),
        "status": "Active",
        "threat_level": "CRITICAL" if phishing_scans > (total_scans * 0.2) else "ELEVATED" if phishing_scans > (total_scans * 0.05) else "NORMAL"
    }
