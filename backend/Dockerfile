FROM python:3.9-slim
WORKDIR /app
# Cài thư viện bổ trợ cho xử lý ảnh (Cực kỳ quan trọng cho Module của Member C)
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0 && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]