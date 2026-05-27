"""
User profile and Family Shield API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.models.user import User, FamilyLink
from app.schemas.auth import UserResponse

router = APIRouter(prefix="/users", tags=["Users & Family"])


# ── Schemas specific to this router ───────────────────────

class UpdateProfileRequest(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    avatar_url: str | None = None
    notify_push: bool | None = None
    notify_email: bool | None = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class FamilyMemberRequest(BaseModel):
    email: str  # Email of the person to add to family network


class FamilyMemberResponse(BaseModel):
    id: int
    guardian_id: int
    protected_id: int
    protected_email: str
    protected_name: str
    status: str

    model_config = {"from_attributes": True}


# ── Profile ───────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update current user profile fields."""
    if data.full_name is not None:
        current_user.full_name = data.full_name
    if data.phone is not None:
        current_user.phone = data.phone
    if data.avatar_url is not None:
        current_user.avatar_url = data.avatar_url
    if data.notify_push is not None:
        current_user.notify_push = data.notify_push
    if data.notify_email is not None:
        current_user.notify_email = data.notify_email

    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change current user's password."""
    from app.core.security import verify_password, hash_password
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Mật khẩu hiện tại không chính xác")
    
    current_user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Mật khẩu đã được thay đổi thành công"}


# ── Family Shield ─────────────────────────────────────────

@router.post("/family", response_model=FamilyMemberResponse, status_code=status.HTTP_201_CREATED)
def add_family_member(
    data: FamilyMemberRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a family member to the Guardian Shield network."""
    protected = db.query(User).filter(User.email == data.email).first()
    if not protected:
        raise HTTPException(status_code=404, detail="User with this email not found")
    if protected.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot add yourself as family member")

    # Check duplicate
    existing = db.query(FamilyLink).filter(
        FamilyLink.guardian_id == current_user.id,
        FamilyLink.protected_id == protected.id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Family member already linked")

    link = FamilyLink(
        guardian_id=current_user.id,
        protected_id=protected.id,
        status="active",
    )
    db.add(link)
    db.commit()
    db.refresh(link)

    return FamilyMemberResponse(
        id=link.id,
        guardian_id=link.guardian_id,
        protected_id=link.protected_id,
        protected_email=protected.email,
        protected_name=protected.full_name,
        status=link.status,
    )


@router.get("/family", response_model=list[FamilyMemberResponse])
def list_family_members(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all family members under current user's protection."""
    links = db.query(FamilyLink).filter(
        FamilyLink.guardian_id == current_user.id
    ).all()

    result = []
    for link in links:
        protected = db.query(User).filter(User.id == link.protected_id).first()
        result.append(FamilyMemberResponse(
            id=link.id,
            guardian_id=link.guardian_id,
            protected_id=link.protected_id,
            protected_email=protected.email if protected else "",
            protected_name=protected.full_name if protected else "",
            status=link.status,
        ))
    return result


@router.delete("/family/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_family_member(
    link_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Remove a family member from the Guardian Shield network."""
    link = db.query(FamilyLink).filter(
        FamilyLink.id == link_id,
        FamilyLink.guardian_id == current_user.id,
    ).first()
    if not link:
        raise HTTPException(status_code=404, detail="Family link not found")

    db.delete(link)
    db.commit()
