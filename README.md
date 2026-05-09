# 🛡️ AI Scam Guardian - Hệ Thống Cảnh Báo Lừa Đảo Thông Minh

**AI Scam Guardian** là nền tảng bảo mật toàn diện giúp người dùng nhận diện và phòng chống các hình thức lừa đảo trực tuyến (Phishing, SMS Scams, Deepfake...) bằng sức mạnh của trí tuệ nhân tạo (AI).

---

## 🚀 Tính Năng Chính

### 1. Phân Tích & Quét Mối Nguy Hiểm (Threat Scanner)
*   **Quét URL:** Tự động nhận diện các trang web giả mạo ngân hàng, mạng xã hội bằng mô hình AI (CNN-1D).
*   **Quét Tin Nhắn:** Phân tích nội dung tin nhắn lừa đảo để đưa ra cảnh báo mức độ rủi ro.

### 2. Trung Tâm Báo Cáo (Report Hub)
*   Cho phép người dùng gửi báo cáo về các trang web, số điện thoại hoặc tài khoản lừa đảo.
*   Theo dõi trạng thái xử lý báo cáo từ đội ngũ Admin.

### 3. Cổng Thông Tin Cộng Đồng (Community Feed)
*   Nơi chia sẻ các chiêu trò lừa đảo mới nhất từ cộng đồng.
*   Cơ chế Upvote/Downvote để đánh giá độ tin cậy của thông tin.

### 4. Kết Nối Gia Đình (Family Link)
*   Tính năng độc đáo cho phép người trẻ bảo vệ người cao tuổi trong gia đình.
*   Nhận thông báo tức thì khi người thân truy cập vào các đường link nguy hiểm.

### 5. Quản Trị Hệ Thống (Admin Dashboard)
*   Quản lý người dùng, duyệt báo cáo và theo dõi hiệu năng của mô hình AI.
*   Hệ thống nhật ký (Audit Logs) ghi lại mọi hoạt động quan trọng.

---

## 🛠️ Công Nghệ Sử Dụng

*   **Backend:** FastAPI (Python), SQLAlchemy, SQLite, JWT Authentication.
*   **Frontend:** React (TypeScript), Vite, Tailwind CSS, Lucide Icons, Recharts.
*   **AI Model:** CNN-1D (Convolutional Neural Network) triển khai qua ONNX Runtime.

---

## 📦 Hướng Dẫn Cài Đặt (Setup)

### 📋 Yêu Cầu Hệ Thống
*   **Python:** Phiên bản 3.10 trở lên.
*   **Node.js:** Phiên bản 18.0 trở lên.
*   **npm:** Đi kèm với Node.js.

### 1. Cài Đặt Backend
Mở Terminal và di chuyển vào thư mục `backend`:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Cài Đặt Frontend
Mở một Terminal khác và di chuyển vào thư mục `frontend`:
```powershell
cd frontend
npm install
```

---

## 🏃 Hướng Dẫn Vận Hành (Running)

### Bước 1: Khởi tạo dữ liệu (Quan trọng)
Lệnh này sẽ tạo file Database SQLite và nạp đầy đủ dữ liệu mẫu (Tài khoản, lịch sử quét, bài báo...) để bạn có thể demo ngay lập tức.
```powershell
# Tại thư mục backend
python seed_data.py
```

### Bước 2: Chạy Backend
```powershell
# Tại thư mục backend
python -m uvicorn app.main:app --reload --port 8888
```
*Hệ thống sẽ chạy tại địa chỉ: `http://127.0.0.1:8888`*

### Bước 3: Chạy Frontend
```powershell
# Tại thư mục frontend
npm run dev
```
*Truy cập ứng dụng tại: `http://127.0.0.1:5173`*

---

## 🔑 Tài Khoản Demo

Để kiểm thử nhanh các tính năng, bạn có thể sử dụng các tài khoản đã được nạp sẵn sau đây:

| Vai Trò | Email | Mật Khẩu |
| :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin@scamguardian.vn` | `admin123` |
| **Người dùng (User)** | `user@example.com` | `user123` |

---

## 📁 Cấu Trúc Thư Mục
*   `/backend`: Chứa mã nguồn API, Logic xử lý và Mô hình AI.
*   `/frontend`: Chứa mã nguồn giao diện người dùng (React components).
*   `/docs`: Tài liệu hướng dẫn chi tiết (nếu có).

---
**AI Scam Guardian Team** - *Bảo vệ bạn và gia đình trong kỷ nguyên số.*
