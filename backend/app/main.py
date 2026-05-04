import logging
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_v1_router
from app.core.config import get_settings
from app.core.database import init_db
from app.ai.url_scanner import load_onnx_model
from contextlib import asynccontextmanager

settings = get_settings()
# Cấu hình log ra cả file và console
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("\n--- [STARTUP STEP 1] Initializing Lifespan ---")
    try:
        print("--- [STARTUP STEP 2] Connecting to Database... ---")
        init_db()
        print("--- [STARTUP STEP 3] Database Connected & Tables Created ---")
        
        print("--- [STARTUP STEP 4] Loading AI Model... ---")
        load_onnx_model()
        print("--- [STARTUP STEP 5] AI Model Loaded ---")
        
        print("✅ AI Scam Guardian v1.0.0 is ready!")
    except Exception as e:
        print(f"❌ CRITICAL STARTUP ERROR: {e}")
        import traceback
        traceback.print_exc()
    yield
    # Shutdown
    print("👋 Shutting down AI Scam Guardian...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}