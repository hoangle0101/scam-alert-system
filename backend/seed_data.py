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
        # 5. Thêm bài viết Academy
        logger.info("Seeding academy articles...")
        articles = [
            KnowledgeArticle(
                title="Cảnh Giác: Hơn 90% Website Giả Mạo Thương Hiệu Lớn Nhằm Chiếm Đoạt Tài Khoản Ngân Hàng",
                content="Các đối tượng lừa đảo thường tạo ra các trang web có giao diện giống hệt ngân hàng, ví điện tử hoặc trang thương mại điện tử nổi tiếng. Chúng sử dụng tên miền có ký tự gần giống (ví dụ: shopee-tri-an.vn thay vì shopee.vn, momo-quatang.com thay vì momo.vn).\n\nCách nhận diện nhanh chóng:\n1. Kiểm tra kỹ thanh địa chỉ URL: Tuyệt đối không nhập thông tin cá nhân vào các trang web có tên miền lạ, sai chính tả hoặc có hậu tố bất thường.\n2. Cảnh giác với giao thức bảo mật: Dù hiện nay nhiều trang giả mạo cũng có chứng chỉ SSL (https), nhưng nếu trình duyệt cảnh báo kết nối không an toàn, hãy lập tức thoát ra.\n3. Không bao giờ cung cấp mã OTP: Ngân hàng và các tổ chức tài chính uy tín không bao giờ yêu cầu khách hàng cung cấp mã OTP dưới bất kỳ hình thức nào. OTP là chốt chặn cuối cùng bảo vệ tài khoản của bạn.",
                category="PHISHING",
                difficulty="beginner",
                author_name="Vortex Scanner",
                read_time_minutes=4,
                view_count=1420,
                thumbnail_url="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
            ),
            KnowledgeArticle(
                title="Cách Nhận Diện Và Phòng Chống Email/SMS Phishing Trong Vòng 3 Phút",
                content="Email và tin nhắn giả mạo (SMS Brandname giả) là vũ khí lợi hại của tin tặc. Chúng thường gửi tin nhắn với tiêu đề khẩn cấp như: 'Tài khoản của bạn đã bị khóa', 'Có giao dịch bất thường 50,000,000đ', hoặc 'Nhận tiền hỗ trợ từ chính phủ'.\n\nCác dấu hiệu nhận biết:\n- Địa chỉ email người gửi có tên miền kỳ lạ (ví dụ: support@ltd-momo.cc).\n- Yêu cầu click vào một đường link rút gọn hoặc liên kết lạ để xác minh thông tin.\n- Lỗi chính tả, câu cú lủng củng do dịch tự động.\n- Tạo cảm giác sợ hãi hoặc hối thúc hành động ngay lập tức.\n\nNếu nhận được tin nhắn như vậy, hãy bình tĩnh, không click vào bất kỳ liên kết nào, và gọi trực tiếp lên số hotline chính thức của đơn vị đó để xác minh thông tin.",
                category="PHISHING",
                difficulty="intermediate",
                author_name="Admin Ops",
                read_time_minutes=5,
                view_count=850,
                thumbnail_url="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800"
            ),
            KnowledgeArticle(
                title="Kịch Bản Lừa Đảo 'Cuộc Gọi Giả Danh Công An' Và Cách Xử Lý Khi Bị Đe Dọa",
                content="Kẻ lừa đảo thường gọi điện tự xưng là cán bộ công an, kiểm sát viên hoặc tòa án, thông báo nạn nhân liên quan đến một vụ án ma túy hoặc rửa tiền quy mô lớn. Chúng yêu cầu nạn nhân không được nói với ai, và phải chuyển toàn bộ tiền tiết kiệm vào một 'tài khoản tạm giữ của cơ quan điều tra' để xác minh.\n\nHãy nhớ 3 nguyên tắc vàng:\n1. Cơ quan công an không bao giờ làm việc qua điện thoại: Khi cần làm việc, cơ quan chức năng sẽ gửi giấy mời hoặc giấy triệu tập hợp pháp thông qua công an địa phương đến tận nhà bạn.\n2. Không chuyển tiền cho bất kỳ ai tự xưng là công an: Không có chuyện cơ quan công an yêu cầu chuyển tiền vào tài khoản cá nhân để 'phục vụ điều tra'.\n3. Báo ngay cho người thân hoặc cơ quan công an gần nhất: Khi nhận cuộc gọi đe dọa, hãy ghi âm lại và mang đến trình báo công an địa phương.",
                category="SOCIAL",
                difficulty="beginner",
                author_name="Proxy Zero",
                read_time_minutes=6,
                view_count=2450,
                thumbnail_url="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800"
            ),
            KnowledgeArticle(
                title="Cảnh Báo Công Nghệ Deepfake Giả Mạo Cuộc Gọi Video Để Vay Tiền Gấp",
                content="Deepfake là công nghệ sử dụng AI để ghép khuôn mặt và giọng nói của một người vào video của người khác một cách cực kỳ chân thực. Kẻ lừa đảo chiếm đoạt Facebook/Zalo của ai đó, sau đó thực hiện cuộc gọi video ngắn cho bạn bè, người thân của họ.\n\nĐể tránh bị nghi ngờ, chúng thường tạo video chập chờn, âm thanh rè và nhanh chóng cúp máy với lý do 'sóng yếu', ngay sau đó nhắn tin nhắn số tài khoản ngân hàng để nhờ chuyển tiền gấp vì lý do khẩn cấp (tai nạn, viện phí, mua vé máy bay...).\n\nCách phòng tránh hiệu quả:\n- Luôn kiểm tra chéo: Hãy gọi lại bằng số điện thoại di động trực tiếp (qua SIM thông thường) để nghe giọng nói thực tế của người thân.\n- Hỏi một câu hỏi bảo mật cá nhân: Hỏi về một kỷ niệm, tên con vật nuôi hoặc bất kỳ thông tin nào mà chỉ hai người biết để kiểm tra xem có đúng là người thân của mình hay không.",
                category="SOCIAL",
                difficulty="advanced",
                author_name="Neural Link",
                read_time_minutes=7,
                view_count=1890,
                thumbnail_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
            ),
            KnowledgeArticle(
                title="Xây Dựng 'Pháo Đài' Bảo Mật Cá Nhân: Tầm Quan Trọng Của 2FA Và Password Manager",
                content="Hơn 80% các vụ tấn công mạng bắt nguồn từ việc mật khẩu yếu hoặc dùng chung một mật khẩu cho nhiều dịch vụ. Nếu tin tặc có được mật khẩu Facebook của bạn, chúng có thể dễ dàng đăng nhập vào email, ví điện tử hoặc tài khoản ngân hàng liên kết.\n\nCác bước bảo vệ tài khoản tối đa:\n1. Bật xác thực 2 yếu tố (2FA): Đây là tính năng bắt buộc. Dù tin tặc có mật khẩu của bạn, chúng vẫn không thể đăng nhập nếu không có mã bảo mật 6 số gửi về điện thoại hoặc ứng dụng Google Authenticator.\n2. Sử dụng trình quản lý mật khẩu (Password Manager): Như Bitwarden, 1Password để tạo ra các mật khẩu ngẫu nhiên dài (ví dụ: xY9!pQ#7zW@a) và lưu trữ chúng an toàn.\n3. Không bao giờ lưu mật khẩu trên trình duyệt công cộng: Luôn đăng xuất tài khoản khi không sử dụng.",
                category="GENERAL",
                difficulty="intermediate",
                author_name="Admin Ops",
                read_time_minutes=5,
                view_count=980,
                thumbnail_url="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800"
            ),
            KnowledgeArticle(
                title="Cẩm Nang Phòng Chống Lừa Đảo Trên Không Gian Mạng Cho Người Cao Tuổi",
                content="Người lớn tuổi thường ít tiếp xúc với các kiến thức công nghệ hiện đại và là mục tiêu yêu thích của các nhóm tội phạm công nghệ cao. Các chiêu trò phổ biến nhắm vào họ bao gồm: lừa đảo trúng thưởng, gọi điện dọa nạt liên quan đến vụ án, hoặc giả mạo con cháu nhắn tin mượn tiền.\n\nLời khuyên dành cho con cháu bảo vệ cha mẹ/ông bà:\n- Cài đặt sẵn ứng dụng bảo mật: Cài đặt Scam Guardian trên máy của cha mẹ và bật tính năng cảnh báo tự động.\n- Thiết lập hạn mức chuyển tiền thấp: Liên hệ ngân hàng để đặt hạn mức giao dịch trực tuyến hàng ngày ở mức vừa phải để giảm thiểu rủi ro nếu bị lừa.\n- Hướng dẫn nguyên tắc 'Bình tĩnh - Xác minh - Chia sẻ': Khi nhận bất kỳ tin tức khẩn cấp nào liên quan đến tiền bạc, phải dừng lại gọi cho con cháu hoặc ra công an phường kiểm chứng.",
                category="GENERAL",
                difficulty="beginner",
                author_name="Admin Ops",
                read_time_minutes=8,
                view_count=3120,
                thumbnail_url="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
            )
        ]
        db.add_all(articles)

        # 6. Community Feed
        logger.info("Seeding community posts...")
        posts = [
            CommunityPost(
                author_id=user.id,
                title="Cảnh giác tin nhắn SMS tuyển dụng 'Cộng tác viên online' giật đơn hàng Shopee/Lazada",
                content="Chào mọi người, dạo gần đây mình liên tục nhận được tin nhắn SMS tuyển nhân viên làm việc tại nhà, thu nhập 300k-800k/ngày. Khi nhấn vào link, họ dẫn dắt vào group Telegram và yêu cầu tải app lạ. Họ bắt mình nạp tiền để giật đơn hàng và nhận hoa hồng 15%. Mấy đơn đầu 100k-500k thì mình rút tiền gốc và lãi bình thường. Đến đơn thứ 4 trị giá 12 triệu, họ bảo tài khoản bị lỗi hệ thống, bắt nạp thêm 20 triệu nữa để giải ngân. Biết là bị lừa nên mình đã dừng lại. Mọi người cảnh giác chiêu trò nạp tiền làm nhiệm vụ giật đơn hàng này nhé!",
                scam_type="LINK_SCAM",
                evidence_url="https://t.me/shopee_work_vietnam",
                image_url="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
                upvotes=75,
                downvotes=2
            ),
            CommunityPost(
                author_id=admin.id,
                title="Trang web mạo danh ngân hàng Vietcombank để đánh cắp thông tin đăng nhập: vcb-digibank-login.com",
                content="Mình phát hiện trang web vcb-digibank-login.com chạy quảng cáo trên Facebook với chương trình đăng ký nhận voucher 200k. Giao diện trang đăng nhập của nó làm giống hệt trang chủ của Vietcombank. Khi mình thử nhập thông tin giả vào, nó lập tức yêu cầu nhập tiếp mã OTP được gửi về điện thoại. Đây là trang web phishing nhằm chiếm đoạt tài khoản ngân hàng. Mong Admin kiểm duyệt và đưa vào danh sách đen cảnh báo cho mọi người!",
                scam_type="PHISHING",
                evidence_url="http://vcb-digibank-login.com",
                image_url="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
                upvotes=110,
                downvotes=0
            ),
            CommunityPost(
                author_id=user.id,
                title="Cảnh báo cuộc gọi video Deepfake giả mạo hình ảnh người thân vay tiền khẩn cấp",
                content="Chiều nay mình nhận được cuộc gọi video từ nick Facebook của chị gái mình. Trên màn hình hiển thị khuôn mặt chị đang ngồi trong bệnh viện, hình ảnh chập chờn và giật lag nói là bị tai nạn cần chuyển gấp 15 triệu để đóng viện phí. Giọng nói nghe rất giống nhưng âm thanh rè và ngắt quãng, sau đó cúp máy với lý do mất sóng. Nghi ngờ có điều mờ ám, mình gọi điện thoại trực tiếp qua số di động của chị thì chị bảo vẫn đang đi làm bình thường, không hề có chuyện tai nạn. Đây là chiêu trò sử dụng công nghệ AI Deepfake để lừa đảo. Mọi người hãy hết sức cảnh giác!",
                scam_type="DEEPFAKES",
                image_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
                upvotes=95,
                downvotes=1
            ),
            CommunityPost(
                author_id=user.id,
                title="Số điện thoại tự xưng là 'Cán bộ Cục Đường bộ' thông báo phạt nguội vi phạm giao thông",
                content="Mình vừa nhận được cuộc gọi từ số 0948.xxx.xxx, tự xưng là đại úy Nguyễn Văn A từ Cục CSGT, thông báo xe của mình có biên bản phạt nguội 5 triệu đồng tại Đà Nẵng (trong khi mình ở Hà Nội và chưa bao giờ lái xe vào Đà Nẵng). Họ yêu cầu cung cấp thông tin căn cước công dân và tải một file '.apk' qua Zalo để kiểm tra hồ sơ vụ án. Đây là chiêu cài cắm mã độc vào điện thoại nhằm đọc tin nhắn OTP ngân hàng. Mình lập tức tắt máy. Mọi người chú ý tuyệt đối không làm theo hướng dẫn của người lạ qua điện thoại!",
                scam_type="PHONE SCAMS",
                image_url="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800",
                upvotes=54,
                downvotes=3
            )
        ]
        db.add_all(posts)
        db.commit()

        # Thêm bình luận cho các bài viết Community để cuộc thảo luận trông thực tế
        logger.info("Seeding community post comments...")
        comments = [
            PostComment(post_id=posts[0].id, author_id=user.id, content="Đúng rồi bạn ơi, mẹ mình vừa bị lừa mất 30 triệu tuần trước bằng chiêu này."),
            PostComment(post_id=posts[0].id, author_id=admin.id, content="Mọi người nhớ là không có công việc nào chỉ cần ngồi click chuột giật đơn mà ra tiền triệu cả. Hãy quét mọi link Telegram lạ bằng Scam Guardian trước nhé."),
            PostComment(post_id=posts[1].id, author_id=admin.id, content="Đã kiểm tra và phê duyệt báo cáo này. URL này hiện đã được đưa vào diện cảnh báo đỏ trên toàn hệ thống."),
            PostComment(post_id=posts[1].id, author_id=user.id, content="May quá mình vừa thấy quảng cáo này trên Facebook xong, định click vào thì nhớ ra check lại. Đúng là lừa đảo!"),
            PostComment(post_id=posts[2].id, author_id=user.id, content="Nguy hiểm thật, công nghệ AI ngày càng chân thực. Gặp những tình huống đòi tiền gấp thế này bắt buộc phải gọi điện thoại thường xác minh."),
            PostComment(post_id=posts[2].id, author_id=admin.id, content="Nhà mình cũng có người bị lừa 20 triệu vì tin vào cuộc gọi video. Người già ở quê rất dễ tin."),
            PostComment(post_id=posts[3].id, author_id=user.id, content="Cơ quan công an hay giao thông phạt nguội luôn gửi giấy báo bằng văn bản về địa chỉ đăng ký xe, tuyệt đối không gọi điện đòi tiền hay bắt tải app thế này.")
        ]
        db.add_all(comments)

        db.commit()
        logger.info("✅ ALL SYSTEMS SEEDED! Data is now live.")

    except Exception as e:
        logger.error(f"❌ Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_everything()
