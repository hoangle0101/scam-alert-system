"""
Knowledge Base ORM model — educational articles & security tips.
"""

from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime, Text

from app.core.database import Base


class KnowledgeArticle(Base):
    __tablename__ = "knowledge_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)  # "phishing" | "sms" | "social" | "general"
    difficulty = Column(String(20), default="beginner")  # "beginner" | "intermediate" | "advanced"
    author_name = Column(String(255), default="AI Scam Guardian Team")
    thumbnail_url = Column(Text, nullable=True)
    read_time_minutes = Column(Integer, default=5)
    is_published = Column(Integer, default=1)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
