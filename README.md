# 🛡️ AI Scam Guardian — Hệ thống Cảnh báo & Phân tích Lừa đảo

Chào mừng các thành viên trong nhóm đến với dự án **Scam Guardian**. Đây là nền tảng bảo mật toàn diện kết hợp giữa Trí tuệ nhân tạo (AI) và cộng đồng để phát hiện, báo cáo và ngăn chặn các hành vi lừa đảo trực tuyến (Phishing URL, SMS, Email).

---

## 🚀 Tính năng chính

### 1. Phân hệ Người dùng (User Portal)
*   **Threat Scanner:** Công cụ quét sâu sử dụng AI (Neural Network) để phân tích link hoặc nội dung tin nhắn. Trả về kết quả Verdict (An toàn/Nguy hiểm/Đáng ngờ) cùng độ tin cậy (Confidence).
*   **Report Hub:** Giao diện báo cáo lừa đảo chuyên nghiệp 3 bước, hỗ trợ gửi bằng chứng và kháng nghị (Appeal) cho các trường hợp nhận diện nhầm.
*   **User Dashboard:** Tổng quan tình trạng bảo mật cá nhân, lịch sử quét và biểu đồ rủi ro toàn cầu.
*   **Security Academy:** Thư viện kiến thức về các thủ đoạn lừa đảo mới nhất.
*   **Community:** Diễn đàn thảo luận và cảnh báo cộng đồng.

### 2. Phân hệ Quản trị (Admin Portal)
*   **System Dashboard:** Theo dõi toàn bộ chỉ số hệ thống (Tổng người dùng, Tỷ lệ bắt lừa đảo, Hiệu năng AI).
*   **Audit Logs:** Nhật ký hoạt động chi tiết của toàn hệ thống phục vụ việc hậu kiểm.
*   **Global Intel:** Bản đồ nhiệt hiển thị các điểm nóng lừa đảo thời gian thực.
*   **Report Management:** Duyệt/Từ chối các báo cáo từ cộng đồng.
*   **Configuration Node:** Quản lý giao thức bảo mật và tích hợp API bên ngoài (Google Safe Browsing, v.v.).

---

## 🛠️ Công nghệ sử dụng

### Backend (Python/FastAPI)
- **Framework:** FastAPI (Hiệu năng cao, Async).
- **Database:** PostgreSQL (hoặc SQLite cho local test) + SQLAlchemy ORM.
- **AI Core:** ONNX Runtime (Chạy model CNN-1D để phân tích Phishing).
- **Security:** JWT Authentication, Bcrypt password hashing.

### Frontend (React/TypeScript)
- **Bundler:** Vite.
- **Styling:** Tailwind CSS (Modern, Responsive).
- **Icons:** Lucide React.
- **Charts/Maps:** Recharts, React Leaflet.
- **State Management:** React Hooks (useState, useEffect).

---

## ⚙️ Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- **Python:** 3.10 trở lên.
- **Node.js:** 18.x trở lên.
- **PostgreSQL:** Đang chạy (mặc định port 5432).

### 2. Thiết lập Backend
1. Mở terminal tại thư mục `backend`.
2. Tạo môi trường ảo (Khuyến nghị):
   ```bash
   python -m venv venv
   source venv/bin/activate  # Trên Windows: .\venv\Scripts\activate
   ```
3. Cài đặt thư viện:
   ```bash
   pip install -r requirements.txt
   ```
4. Cấu hình môi trường:
   - Tạo file `.env` từ file mẫu (nếu có) và chỉnh sửa `DATABASE_URL` cho đúng với DB của bạn.
5. Chạy Backend:
   ```bash
   python -m uvicorn app.main:app --reload --port 8001
   ```

### 3. Thiết lập Frontend
1. Mở terminal tại thư mục `frontend`.
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Chạy Frontend (Development mode):
   ```bash
   npm run dev
   ```
4. Truy cập: `http://localhost:5173`

---

## 📁 Cấu trúc thư mục

```text
scam-alert-system/
├── backend/
│   ├── app/
│   │   ├── ai/            # Logic tiền xử lý và chạy model AI
│   │   ├── api/           # Các router API (User, Admin, Scan...)
│   │   ├── core/          # Cấu hình DB, Security, Dependencies
│   │   ├── models/        # Định nghĩa các bảng Database
│   │   └── schemas/       # Pydantic models cho Request/Response
│   ├── models/            # File model AI (.onnx)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # UI Components dùng chung (Button, Card, Map...)
│   │   ├── pages/         # Các trang chính (UserDashboard, ThreatScanner...)
│   │   ├── services/      # API client (Axios/Fetch wrapper)
│   │   └── App.tsx        # Routing chính
│   └── package.json
└── README.md
```

---

## 📝 Lưu ý cho thành viên
- Khi code tính năng mới, hãy luôn ưu tiên sử dụng các component có sẵn trong `frontend/src/components`.
- Đảm bảo Backend và Frontend đều đang chạy cùng lúc để API có thể tương tác.
- Admin mặc định: Kiểm tra trong Database hoặc chạy script seed dữ liệu.

---
*Chúc nhóm chúng ta hoàn thành xuất sắc đồ án!* 🚀
