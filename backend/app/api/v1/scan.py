from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.scan_service import ScanService
from pydantic import BaseModel

router = APIRouter(prefix="/scan", tags=["Scanner"])

# Dùng Class này để hứng dữ liệu
class URLScanRequest(BaseModel):
    url: str

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

@router.get("/history")
async def get_scan_history(db: Session = Depends(get_db)):
    return {"results": []}
