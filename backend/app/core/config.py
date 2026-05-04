import os
from pathlib import Path
from typing import Optional, Union, List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

# Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    # App Info
    APP_NAME: str = "AI Scam Guardian"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite:///scam_guardian.db"
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-in-production-2025"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # AI Paths
    CHAR_INDEX_PATH: str = str(BASE_DIR / "app" / "ai" / "char_index.json")
    PHISHING_THRESHOLD: float = 0.5
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = ["http://localhost:5173", "http://localhost:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str) and v.startswith("["):
            import json
            try:
                return json.loads(v)
            except:
                return [v]
        return v

    # Cấu hình Pydantic
    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"  # QUAN TRỌNG: Bỏ qua các biến thừa trong .env để không gây lỗi
    )

def get_settings():
    return Settings()
