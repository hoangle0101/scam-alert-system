"""
Knowledge Base API — educational articles and security tips.
"""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user, get_current_admin
from app.models.user import User
from app.models.knowledge import KnowledgeArticle

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base"])


# ── Schemas ───────────────────────────────────────────────

class ArticleResponse(BaseModel):
    id: int
    title: str
    content: str
    category: str
    difficulty: str
    author_name: str
    thumbnail_url: str | None
    read_time_minutes: int
    view_count: int
    created_at: datetime | None

    model_config = {"from_attributes": True}


class CreateArticleRequest(BaseModel):
    title: str
    content: str
    category: str
    difficulty: str = "beginner"
    thumbnail_url: str | None = None
    read_time_minutes: int = 5


class UpdateArticleRequest(BaseModel):
    title: str | None = None
    content: str | None = None
    category: str | None = None
    difficulty: str | None = None
    is_published: int | None = None


class ArticleListResponse(BaseModel):
    total: int
    page: int
    per_page: int
    articles: list[ArticleResponse]


# ── Public Routes ─────────────────────────────────────────

@router.get("/articles", response_model=ArticleListResponse)
def list_articles(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category: str | None = None,
    search: str | None = None,
    db: Session = Depends(get_db),
):
    """List published knowledge articles (public, paginated)."""
    query = db.query(KnowledgeArticle).filter(KnowledgeArticle.is_published == 1)

    if category:
        query = query.filter(KnowledgeArticle.category == category)
    if search:
        query = query.filter(KnowledgeArticle.title.ilike(f"%{search}%"))

    total = query.count()
    articles = (
        query
        .order_by(KnowledgeArticle.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    return ArticleListResponse(
        total=total,
        page=page,
        per_page=per_page,
        articles=[ArticleResponse.model_validate(a) for a in articles],
    )


@router.get("/articles/{article_id}", response_model=ArticleResponse)
def get_article(article_id: int, db: Session = Depends(get_db)):
    """Get a single article and increment view count."""
    article = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    article.view_count += 1
    db.commit()
    db.refresh(article)
    return ArticleResponse.model_validate(article)


# ── Admin Routes ──────────────────────────────────────────

@router.post("/articles", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
def create_article(
    data: CreateArticleRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Create a new knowledge article (admin only)."""
    article = KnowledgeArticle(
        title=data.title,
        content=data.content,
        category=data.category,
        difficulty=data.difficulty,
        thumbnail_url=data.thumbnail_url,
        read_time_minutes=data.read_time_minutes,
        author_name=admin.full_name,
    )
    db.add(article)
    db.commit()
    db.refresh(article)
    return ArticleResponse.model_validate(article)


@router.patch("/articles/{article_id}", response_model=ArticleResponse)
def update_article(
    article_id: int,
    data: UpdateArticleRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Update an existing knowledge article (admin only)."""
    article = db.query(KnowledgeArticle).filter(KnowledgeArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(article, field, value)

    db.commit()
    db.refresh(article)
    return ArticleResponse.model_validate(article)
