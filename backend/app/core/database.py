"""
Database engine and session management.
Supports both SQLite (dev) and PostgreSQL (production).
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import get_settings

settings = get_settings()

# ── Engine ────────────────────────────────────────────────
# SQLite requires check_same_thread=False for FastAPI
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=settings.DEBUG,
    pool_pre_ping=True,
)

# ── Session factory ───────────────────────────────────────
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ── Base model ────────────────────────────────────────────
class Base(DeclarativeBase):
    """SQLAlchemy declarative base for all ORM models."""
    pass

def init_db() -> None:
    """Create all tables. Called once at startup."""
    # Import all models so they are registered on Base.metadata
    from app.models.user import User
    from app.models.scan import ScanResult
    from app.models.community import CommunityPost, PostComment
    from app.models.knowledge import KnowledgeArticle
    from app.models.audit import AuditLog
    from app.models.report import ScamReport, FalsePositiveAppeal
    
    Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency for getting a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
