import logging
import traceback
from sqlalchemy.orm import Session
from app.models.scan import ScanResult
from app.models.user import User
from app.models.audit import AuditLog
from app.ai.url_scanner import scan_url as ai_scan_url

logger = logging.getLogger(__name__)

class ScanService:
    @staticmethod
    async def scan_url(db: Session, url: str, user: User = None) -> dict:
        """
        Orchestrate URL scanning: AI analysis + Persistence + Audit logging.
        """
        try:
            # 1. Thực hiện quét AI
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
                details={"url": url, "verdict": verdict},
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
