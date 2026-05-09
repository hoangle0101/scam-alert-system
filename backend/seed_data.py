import logging
from datetime import datetime, timedelta, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import get_settings
from app.core.database import Base
from app.models.user import User, FamilyLink
from app.models.knowledge import KnowledgeArticle
from app.models.community import CommunityPost, PostComment
from app.models.scan import ScanResult
from app.models.report import ScamReport
from app.core.security import hash_password

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_everything():
    settings = get_settings()
    engine = create_engine(settings.DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()

    try:
        logger.info("Initializing database tables...")
        Base.metadata.drop_all(bind=engine) # Làm sạch để tránh lỗi duplicate khi chạy lại
        Base.metadata.create_all(bind=engine)

        # 1. Tạo Admin & User
        logger.info("Creating users...")
        admin = User(
            email="admin@scamguardian.vn",
            full_name="Admin Ops",
            hashed_password=hash_password("admin123"),
            role="admin"
        )
        user = User(
            email="user@example.com",
            full_name="Hoàng Lê",
            hashed_password=hash_password("user123"),
            role="user"
        )
        db.add_all([admin, user])
        db.commit()
        db.refresh(admin)
        db.refresh(user)

        # 2. Tạo Family Link
        logger.info("Creating family links...")
        link = FamilyLink(guardian_id=user.id, protected_id=admin.id, status="active") # Demo: User bảo vệ Admin
        db.add(link)

        # 3. Tạo Lịch sử quét (Để Dashboard có số)
        logger.info("Seeding scan history...")
        scans = [
            ScanResult(user_id=user.id, scan_type="url", input_value="http://shopee-qua-tang.vn", verdict="phishing", risk_level="HIGH", confidence=0.98, processing_time_ms=120, model_version="v1.2"),
            ScanResult(user_id=user.id, scan_type="url", input_value="https://google.com", verdict="legitimate", risk_level="SAFE", confidence=0.99, processing_time_ms=45, model_version="v1.2"),
            ScanResult(user_id=user.id, scan_type="message", input_value="Chúc mừng bạn trúng iPhone 15, nhấn vào link...", verdict="phishing", risk_level="CRITICAL", confidence=0.95, processing_time_ms=210, model_version="v1.2"),
            ScanResult(user_id=user.id, scan_type="url", input_value="http://bit.ly/nhan-qua-free-fire", verdict="suspicious", risk_level="MEDIUM", confidence=0.75, processing_time_ms=88, model_version="v1.2"),
        ]
        db.add_all(scans)

        # 4. Thêm báo cáo Scam (Report Hub)
        logger.info("Seeding scam reports...")
        reports = [
            ScamReport(user_id=user.id, target_type="url", target_value="http://m-facebook.com-login.vn", scam_category="phishing", description="Trang web giả mạo Facebook để chiếm đoạt tài khoản", status="pending"),
            ScamReport(user_id=user.id, target_type="phone", target_value="0912345678", scam_category="social", description="Gọi điện giả danh công an yêu cầu chuyển tiền", status="approved")
        ]
        db.add_all(reports)

        # 5. Thêm bài viết Academy
        logger.info("Seeding academy articles...")
        articles = [
            KnowledgeArticle(title="5 Cách nhận biết Website giả mạo", content="Hãy kiểm tra chứng chỉ SSL và tên miền...", category="Security Basics", author_name="Admin Ops"),
            KnowledgeArticle(title="Deepfake: Mối nguy hiểm mới", content="Công nghệ AI đang được dùng để giả giọng nói...", category="Advanced Threats", author_name="Admin Ops")
        ]
        db.add_all(articles)

        # 6. Community Feed
        logger.info("Seeding community posts...")
        post = CommunityPost(
            author_id=user.id,
            title="Cảnh giác với đầu số +88 từ nước ngoài",
            content="Sáng nay mình vừa nhận được cuộc gọi từ đầu số này, họ bảo là nhân viên bưu điện...",
            scam_type="SOCIAL SCAMS",
            upvotes=25
        )
        db.add(post)

        db.commit()
        logger.info("✅ ALL SYSTEMS SEEDED! Data is now live.")

    except Exception as e:
        logger.error(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_everything()
