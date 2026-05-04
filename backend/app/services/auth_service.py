"""
Authentication service — registration, login, token management.
"""

from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse


class AuthService:
    """Handles all authentication business logic."""

    @staticmethod
    def register(db: Session, data: RegisterRequest) -> User:
        """Register a new user account."""
        # Check duplicate email
        existing = db.query(User).filter(User.email == data.email).first()
        if existing:
            raise ValueError("Email already registered")

        user = User(
            email=data.email,
            full_name=data.full_name,
            hashed_password=hash_password(data.password),
            role="user",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def login(db: Session, data: LoginRequest) -> TokenResponse:
        """Authenticate user and return JWT tokens."""
        user = db.query(User).filter(User.email == data.email).first()
        if not user or not verify_password(data.password, user.hashed_password):
            raise ValueError("Invalid email or password")
        if not user.is_active:
            raise ValueError("Account is deactivated")

        token_data = {"sub": str(user.id), "role": user.role}
        return TokenResponse(
            access_token=create_access_token(token_data),
            refresh_token=create_refresh_token(token_data),
        )

    @staticmethod
    def refresh(db: Session, refresh_token: str) -> TokenResponse:
        """Refresh access token using a valid refresh token."""
        payload = decode_token(refresh_token)
        if payload is None or payload.get("type") != "refresh":
            raise ValueError("Invalid refresh token")

        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == int(user_id)).first()
        if not user or not user.is_active:
            raise ValueError("User not found or deactivated")

        token_data = {"sub": str(user.id), "role": user.role}
        return TokenResponse(
            access_token=create_access_token(token_data),
            refresh_token=create_refresh_token(token_data),
        )
