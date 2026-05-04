"""
Community Portal API — scam reports, comments, voting.
"""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.community import CommunityPost, PostComment, PostVote
from app.models.audit import AuditLog

router = APIRouter(prefix="/community", tags=["Community Portal"])


# ── Schemas ───────────────────────────────────────────────

class CreatePostRequest(BaseModel):
    title: str
    content: str
    scam_type: str | None = None
    evidence_url: str | None = None


class CommentRequest(BaseModel):
    content: str


class VoteRequest(BaseModel):
    vote_type: str  # "up" | "down"


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    scam_type: str | None
    evidence_url: str | None
    status: str
    upvotes: int
    downvotes: int
    author_name: str
    author_email: str
    comment_count: int = 0
    created_at: datetime | None

    model_config = {"from_attributes": True}


class CommentResponse(BaseModel):
    id: int
    content: str
    author_name: str
    created_at: datetime | None

    model_config = {"from_attributes": True}


class PostListResponse(BaseModel):
    total: int
    page: int
    per_page: int
    posts: list[PostResponse]


# ── Routes ────────────────────────────────────────────────

@router.get("/posts", response_model=PostListResponse)
def list_posts(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    scam_type: str | None = None,
    db: Session = Depends(get_db),
):
    """List community scam reports (paginated, public)."""
    query = db.query(CommunityPost).filter(CommunityPost.status == "published")
    if scam_type:
        query = query.filter(CommunityPost.scam_type == scam_type)

    total = query.count()
    posts = (
        query
        .order_by(CommunityPost.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    result = []
    for post in posts:
        author = db.query(User).filter(User.id == post.author_id).first()
        result.append(PostResponse(
            id=post.id,
            title=post.title,
            content=post.content,
            scam_type=post.scam_type,
            evidence_url=post.evidence_url,
            status=post.status,
            upvotes=post.upvotes,
            downvotes=post.downvotes,
            author_name=author.full_name if author else "Unknown",
            author_email=author.email if author else "",
            comment_count=post.comments.count(),
            created_at=post.created_at,
        ))

    return PostListResponse(total=total, page=page, per_page=per_page, posts=result)


@router.post("/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    data: CreatePostRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new scam report in the community portal."""
    post = CommunityPost(
        author_id=current_user.id,
        title=data.title,
        content=data.content,
        scam_type=data.scam_type,
        evidence_url=data.evidence_url,
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    return PostResponse(
        id=post.id,
        title=post.title,
        content=post.content,
        scam_type=post.scam_type,
        evidence_url=post.evidence_url,
        status=post.status,
        upvotes=post.upvotes,
        downvotes=post.downvotes,
        author_name=current_user.full_name,
        author_email=current_user.email,
        comment_count=0,
        created_at=post.created_at,
    )


@router.get("/posts/{post_id}", response_model=PostResponse)
def get_post(post_id: int, db: Session = Depends(get_db)):
    """Get a single post with details."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    author = db.query(User).filter(User.id == post.author_id).first()
    return PostResponse(
        id=post.id,
        title=post.title,
        content=post.content,
        scam_type=post.scam_type,
        evidence_url=post.evidence_url,
        status=post.status,
        upvotes=post.upvotes,
        downvotes=post.downvotes,
        author_name=author.full_name if author else "Unknown",
        author_email=author.email if author else "",
        comment_count=post.comments.count(),
        created_at=post.created_at,
    )


@router.get("/posts/{post_id}/comments", response_model=list[CommentResponse])
def list_comments(post_id: int, db: Session = Depends(get_db)):
    """Get all comments for a post."""
    comments = (
        db.query(PostComment)
        .filter(PostComment.post_id == post_id)
        .order_by(PostComment.created_at.asc())
        .all()
    )
    result = []
    for comment in comments:
        author = db.query(User).filter(User.id == comment.author_id).first()
        result.append(CommentResponse(
            id=comment.id,
            content=comment.content,
            author_name=author.full_name if author else "Unknown",
            created_at=comment.created_at,
        ))
    return result


@router.post("/posts/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def add_comment(
    post_id: int,
    data: CommentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a comment to a community post."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = PostComment(
        post_id=post_id,
        author_id=current_user.id,
        content=data.content,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return CommentResponse(
        id=comment.id,
        content=comment.content,
        author_name=current_user.full_name,
        created_at=comment.created_at,
    )


@router.post("/posts/{post_id}/vote", status_code=status.HTTP_200_OK)
def vote_post(
    post_id: int,
    data: VoteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upvote or downvote a community post."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Check existing vote
    existing = db.query(PostVote).filter(
        PostVote.post_id == post_id,
        PostVote.user_id == current_user.id,
    ).first()

    if existing:
        # Change vote
        if existing.vote_type == data.vote_type:
            return {"message": "Vote unchanged"}
        if existing.vote_type == "up":
            post.upvotes = max(0, post.upvotes - 1)
        else:
            post.downvotes = max(0, post.downvotes - 1)
        existing.vote_type = data.vote_type
    else:
        vote = PostVote(
            post_id=post_id,
            user_id=current_user.id,
            vote_type=data.vote_type,
        )
        db.add(vote)

    if data.vote_type == "up":
        post.upvotes += 1
    else:
        post.downvotes += 1

    db.commit()
    return {"message": f"Vote '{data.vote_type}' recorded", "upvotes": post.upvotes, "downvotes": post.downvotes}
