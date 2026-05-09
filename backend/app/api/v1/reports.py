from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.report import ScamReport, FalsePositiveAppeal
from pydantic import BaseModel
from typing import Optional, List
import time

router = APIRouter(prefix="/reports", tags=["Reports"])

class ScamReportCreate(BaseModel):
    target_type: str
    target_value: str
    scam_category: str
    description: Optional[str] = None
    evidence_url: Optional[str] = None

class FalsePositiveAppealCreate(BaseModel):
    scan_result_id: Optional[int] = None
    target_url: str
    reason: str
    evidence_url: Optional[str] = None

@router.post("/scam")
async def submit_scam_report(report: ScamReportCreate, db: Session = Depends(get_db)):
    """
    User submits a new scam report.
    """
    # Mocking user_id = 1 for now since auth might not be fully wired up in the demo
    user_id = 1 
    
    new_report = ScamReport(
        user_id=user_id,
        target_type=report.target_type,
        target_value=report.target_value,
        scam_category=report.scam_category,
        description=report.description,
        evidence_url=report.evidence_url,
        status="pending"
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    # Simulate some processing delay
    time.sleep(1)
    
    return {"status": "success", "message": "Report submitted successfully", "report_id": new_report.id}

@router.post("/appeal")
async def submit_appeal(appeal: FalsePositiveAppealCreate, db: Session = Depends(get_db)):
    """
    User submits a false positive appeal.
    """
    user_id = 1 
    
    new_appeal = FalsePositiveAppeal(
        user_id=user_id,
        scan_result_id=appeal.scan_result_id,
        target_url=appeal.target_url,
        reason=appeal.reason,
        evidence_url=appeal.evidence_url,
        status="pending"
    )
    
    db.add(new_appeal)
    db.commit()
    db.refresh(new_appeal)
    
    time.sleep(1)
    
    return {"status": "success", "message": "Appeal submitted successfully", "appeal_id": new_appeal.id}

@router.get("/my-reports")
async def get_my_reports(db: Session = Depends(get_db)):
    """
    Get all reports and appeals for the current user.
    """
    user_id = 1
    
    reports = db.query(ScamReport).filter(ScamReport.user_id == user_id).order_by(desc(ScamReport.created_at)).all()
    appeals = db.query(FalsePositiveAppeal).filter(FalsePositiveAppeal.user_id == user_id).order_by(desc(FalsePositiveAppeal.created_at)).all()
    
    result = []
    for r in reports:
        result.append({
            "id": f"R-{r.id}",
            "type": "Scam Report",
            "target": r.target_value,
            "category": r.scam_category,
            "status": r.status,
            "date": r.created_at.isoformat()
        })
        
    for a in appeals:
        result.append({
            "id": f"A-{a.id}",
            "type": "False Positive Appeal",
            "target": a.target_url,
            "category": "Appeal",
            "status": a.status,
            "date": a.created_at.isoformat()
        })
        
    # Sort by date descending
    result.sort(key=lambda x: x["date"], reverse=True)
    
    return result
