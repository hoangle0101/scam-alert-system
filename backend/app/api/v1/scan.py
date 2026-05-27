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
    model_type: str = "cnn"  # "cnn" or "xgboost"

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
        print(f"\n[DEBUG] RECEIVED SCAN REQUEST FOR: {data.url} USING MODEL: {data.model_type}")
        
        result = await ScanService.scan_url(db, data.url, None, data.model_type)
        return result
    except Exception as e:
        import traceback
        print("\n[ERROR] EXCEPTION IN SCAN ROUTE:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

    # Removed scan_message endpoint

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
                "model_version": r.model_version,
                "processing_time_ms": r.processing_time_ms,
                "analysis_details": r.analysis_details,
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

    # Tính toán tọa độ bản đồ mối đe dọa thực tế
    nodes = {
        "hanoi": {"id": 1, "lat": 21.0285, "lng": 105.8542, "name": "Hanoi (SEA Cluster)", "intensity": "low", "count": 0, "threats": 0},
        "tokyo": {"id": 2, "lat": 35.6762, "lng": 139.6503, "name": "Tokyo Node", "intensity": "low", "count": 0, "threats": 0},
        "london": {"id": 3, "lat": 51.5074, "lng": -0.1278, "name": "London Proxy", "intensity": "low", "count": 0, "threats": 0},
        "newyork": {"id": 4, "lat": 40.7128, "lng": -74.0060, "name": "NY Gateway", "intensity": "low", "count": 0, "threats": 0},
        "sydney": {"id": 5, "lat": -33.8688, "lng": 151.2093, "name": "Sydney Hub", "intensity": "low", "count": 0, "threats": 0},
        "moscow": {"id": 6, "lat": 55.7558, "lng": 37.6173, "name": "Moscow Relay", "intensity": "low", "count": 0, "threats": 0},
        "saopaulo": {"id": 7, "lat": -23.5505, "lng": -46.6333, "name": "São Paulo End", "intensity": "low", "count": 0, "threats": 0},
    }

    all_scans = db.query(ScanResult).all()
    for s in all_scans:
        val = s.input_value.lower()
        is_threat = s.verdict in ["phishing", "suspicious"]
        
        if ".vn" in val:
            target = "hanoi"
        elif ".jp" in val:
            target = "tokyo"
        elif ".uk" in val or ".eu" in val or ".fr" in val or ".de" in val:
            target = "london"
        elif ".ru" in val:
            target = "moscow"
        elif ".br" in val or ".ar" in val:
            target = "saopaulo"
        else:
            h = hash(val) % 3
            if h == 0:
                target = "newyork"
            elif h == 1:
                target = "sydney"
            else:
                target = "hanoi"
        
        nodes[target]["count"] += 1
        if is_threat:
            nodes[target]["threats"] += 1

    for k, node in nodes.items():
        if node["threats"] > 5:
            node["intensity"] = "high"
        elif node["threats"] > 1:
            node["intensity"] = "medium"
        else:
            node["intensity"] = "low"
            
    map_stats = list(nodes.values())

    return {
        "total_scans": total_scans,
        "phishing_scans": phishing_scans,
        "suspicious_scans": suspicious_scans,
        "safe_scans": safe_scans,
        "avg_latency_ms": round(avg_latency, 2),
        "status": "Active",
        "threat_level": "CRITICAL" if phishing_scans > (total_scans * 0.2) else "ELEVATED" if phishing_scans > (total_scans * 0.05) else "NORMAL",
        "map_stats": map_stats
    }
