import logging
import traceback
from sqlalchemy.orm import Session
from app.models.scan import ScanResult
from app.models.user import User
from app.models.audit import AuditLog
from app.models.report import ScamReport
from app.ai.url_scanner import scan_url as ai_scan_url
from app.ai.xgboost_scanner import scan_url_xgboost

logger = logging.getLogger(__name__)

def normalize_url(u: str) -> str:
    u = u.strip().lower()
    if u.startswith("https://"):
        u = u[8:]
    elif u.startswith("http://"):
        u = u[7:]
    if u.startswith("www."):
        u = u[4:]
    if u.endswith("/"):
        u = u[:-1]
    return u

class ScanService:
    @staticmethod
    async def scan_url(db: Session, url: str, user: User = None, model_type: str = "cnn") -> dict:
        """
        Orchestrate URL scanning: AI analysis + Persistence + Audit logging.
        """
        try:
            # Check if this URL matches any approved scam report
            normalized_scan_url = normalize_url(url)
            approved_reports = db.query(ScamReport).filter(ScamReport.status == "approved").all()
            matching_report = None
            for r in approved_reports:
                if r.target_value and normalize_url(r.target_value) == normalized_scan_url:
                    matching_report = r
                    break

            if matching_report:
                ai_result = {
                    "verdict": "phishing",
                    "risk_level": "CRITICAL",
                    "confidence": 1.0,
                    "processing_time_ms": 0.0,
                    "model_version": "community-verified",
                    "analysis_details": {
                        "ai_score": 1.0,
                        "heuristic_score": 1.0,
                        "signals": [
                            {
                                "name": "Community Blocklist",
                                "score": 1.0,
                                "detail": f"This URL has been verified as dangerous by security administrators. Category: {matching_report.scam_category}. Description: {matching_report.description or 'No description'}"
                            }
                        ]
                    }
                }
            else:
                # 1. Thực hiện quét AI tùy theo model
                if model_type == "xgboost":
                    ai_result = await scan_url_xgboost(url)
                else:
                    ai_result = await ai_scan_url(url)
            
            # Đảm bảo các giá trị không bị None trước khi lưu DB
            verdict = ai_result.get("verdict", "unknown")
            risk_level = ai_result.get("risk_level", "UNKNOWN")
            confidence = ai_result.get("confidence", 0.0)
            
            # 2. Lưu kết quả vào Database
            db_result = ScanResult(
                user_id=user.id if user else None,
                scan_type="url",
                input_value=url,
                verdict=str(verdict),
                risk_level=str(risk_level),
                confidence=float(confidence),
                processing_time_ms=float(ai_result.get("processing_time_ms", 0.0)),
                model_version=str(ai_result.get("model_version", "v1")),
                analysis_details=ai_result.get("analysis_details", {}),
                is_false_positive=False
            )
            db.add(db_result)
            
            # 3. Ghi Log kiểm toán
            audit = AuditLog(
                user_id=user.id if user else None,
                action="scan.url",
                resource="url",
                resource_id=None,
                details={"url": url, "model": model_type, "verdict": verdict},
                status="success"
            )
            db.add(audit)
            
            db.commit()
            db.refresh(db_result)
            
            return ai_result

        except Exception as e:
            db.rollback()
            print("--- CRITICAL SCAN ERROR START ---")
            traceback.print_exc()
            print("--- CRITICAL SCAN ERROR END ---")
            logger.error(f"Scan Service Error: {e}")
            # Trả về một kết quả lỗi giả lập để Frontend không bị 500
            return {
                "verdict": "error",
                "risk_level": "UNKNOWN",
                "confidence": 0.0,
                "error": str(e)
            }

    # Removed scan_message method
