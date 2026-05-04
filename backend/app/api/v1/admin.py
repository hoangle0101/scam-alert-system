"""
Admin API endpoints — dashboard stats, user management, audit logs, model metrics.
"""

from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_admin
from app.models.user import User
from app.models.scan import ScanResult
from app.models.community import CommunityPost
from app.models.knowledge import KnowledgeArticle
from app.models.audit import AuditLog
from app.schemas.auth import UserResponse
from app.schemas.scan import ScanResultResponse

router = APIRouter(prefix="/admin", tags=["Admin"])


# ── Schemas ───────────────────────────────────────────────

class DashboardStats(BaseModel):
    total_users: int
    active_users: int
    total_scans: int
    scans_today: int
    threats_detected: int
    community_posts: int
    knowledge_articles: int
    scan_by_verdict: dict
    scan_by_type: dict
    recent_scans: list[ScanResultResponse]


class UserAdminResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime | None
    total_scans: int = 0

    model_config = {"from_attributes": True}


class UserListResponse(BaseModel):
    total: int
    page: int
    per_page: int
    users: list[UserAdminResponse]


class UpdateUserRequest(BaseModel):
    role: str | None = None
    is_active: bool | None = None


class AuditLogResponse(BaseModel):
    id: int
    user_id: int | None
    action: str
    resource: str | None
    resource_id: int | None
    details: dict | None
    ip_address: str | None
    status: str
    created_at: datetime | None

    model_config = {"from_attributes": True}


class AuditLogListResponse(BaseModel):
    total: int
    page: int
    per_page: int
    logs: list[AuditLogResponse]


class ModelMetrics(BaseModel):
    model_version: str
    total_predictions: int
    phishing_detected: int
    legitimate_count: int
    suspicious_count: int
    avg_confidence: float
    avg_processing_time_ms: float


# ── Dashboard ─────────────────────────────────────────────

@router.get("/dashboard", response_model=DashboardStats)
def admin_dashboard(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Get comprehensive admin dashboard statistics."""
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    total_scans = db.query(ScanResult).count()
    scans_today = db.query(ScanResult).filter(ScanResult.created_at >= today).count()

    threats_detected = db.query(ScanResult).filter(
        ScanResult.verdict.in_(["phishing", "suspicious"])
    ).count()

    community_posts = db.query(CommunityPost).count()
    knowledge_articles = db.query(KnowledgeArticle).count()

    # Scan distribution by verdict
    verdict_counts = db.query(
        ScanResult.verdict, func.count(ScanResult.id)
    ).group_by(ScanResult.verdict).all()
    scan_by_verdict = {v: c for v, c in verdict_counts}

    # Scan distribution by type
    type_counts = db.query(
        ScanResult.scan_type, func.count(ScanResult.id)
    ).group_by(ScanResult.scan_type).all()
    scan_by_type = {t: c for t, c in type_counts}

    # Recent scans
    recent = (
        db.query(ScanResult)
        .order_by(ScanResult.created_at.desc())
        .limit(10)
        .all()
    )

    return DashboardStats(
        total_users=total_users,
        active_users=active_users,
        total_scans=total_scans,
        scans_today=scans_today,
        threats_detected=threats_detected,
        community_posts=community_posts,
        knowledge_articles=knowledge_articles,
        scan_by_verdict=scan_by_verdict,
        scan_by_type=scan_by_type,
        recent_scans=[ScanResultResponse.model_validate(s) for s in recent],
    )


# ── User Management ──────────────────────────────────────

@router.get("/users", response_model=UserListResponse)
def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: str | None = None,
    role: str | None = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """List all users with search and role filtering (admin only)."""
    query = db.query(User)
    if search:
        query = query.filter(
            (User.email.ilike(f"%{search}%")) | (User.full_name.ilike(f"%{search}%"))
        )
    if role:
        query = query.filter(User.role == role)

    total = query.count()
    users = (
        query
        .order_by(User.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    result = []
    for user in users:
        scan_count = db.query(ScanResult).filter(ScanResult.user_id == user.id).count()
        result.append(UserAdminResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            is_active=user.is_active,
            created_at=user.created_at,
            total_scans=scan_count,
        ))

    return UserListResponse(total=total, page=page, per_page=per_page, users=result)


@router.patch("/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    data: UpdateUserRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Update user role or status (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot modify your own admin account")

    if data.role is not None:
        user.role = data.role
    if data.is_active is not None:
        user.is_active = data.is_active

    # Audit log
    audit = AuditLog(
        user_id=admin.id,
        action="admin.update_user",
        resource="user",
        resource_id=user_id,
        details=data.model_dump(exclude_unset=True),
        status="success",
    )
    db.add(audit)
    db.commit()
    db.refresh(user)
    return user


# ── Audit Logs ────────────────────────────────────────────

@router.get("/audit-logs", response_model=AuditLogListResponse)
def list_audit_logs(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
    action: str | None = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """List system audit logs (admin only)."""
    query = db.query(AuditLog)
    if action:
        query = query.filter(AuditLog.action.ilike(f"%{action}%"))

    total = query.count()
    logs = (
        query
        .order_by(AuditLog.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    return AuditLogListResponse(
        total=total,
        page=page,
        per_page=per_page,
        logs=[AuditLogResponse.model_validate(log) for log in logs],
    )


# ── All Scans (Admin) ────────────────────────────────────

@router.get("/scans", response_model=dict)
def list_all_scans(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=200),
    verdict: str | None = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """List all scan results system-wide (admin only)."""
    query = db.query(ScanResult)
    if verdict:
        query = query.filter(ScanResult.verdict == verdict)

    total = query.count()
    scans = (
        query
        .order_by(ScanResult.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "per_page": per_page,
        "scans": [ScanResultResponse.model_validate(s) for s in scans],
    }


# ── Model Metrics ─────────────────────────────────────────

@router.get("/model-metrics", response_model=ModelMetrics)
def model_metrics(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Get AI model performance metrics (admin only)."""
    total = db.query(ScanResult).filter(ScanResult.scan_type == "url").count()
    phishing = db.query(ScanResult).filter(
        ScanResult.scan_type == "url", ScanResult.verdict == "phishing"
    ).count()
    legitimate = db.query(ScanResult).filter(
        ScanResult.scan_type == "url", ScanResult.verdict == "legitimate"
    ).count()
    suspicious = db.query(ScanResult).filter(
        ScanResult.scan_type == "url", ScanResult.verdict == "suspicious"
    ).count()

    avg_conf = db.query(func.avg(ScanResult.confidence)).filter(
        ScanResult.scan_type == "url"
    ).scalar() or 0.0

    avg_time = db.query(func.avg(ScanResult.processing_time_ms)).filter(
        ScanResult.scan_type == "url"
    ).scalar() or 0.0

    return ModelMetrics(
        model_version="cnn-1d-onnx-v1+heuristic",
        total_predictions=total,
        phishing_detected=phishing,
        legitimate_count=legitimate,
        suspicious_count=suspicious,
        avg_confidence=round(float(avg_conf), 4),
        avg_processing_time_ms=round(float(avg_time), 2),
    )
