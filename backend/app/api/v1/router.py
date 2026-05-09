"""
API v1 main router — aggregates all sub-routers.
"""

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.scan import router as scan_router
from app.api.v1.users import router as users_router
from app.api.v1.community import router as community_router
from app.api.v1.knowledge import router as knowledge_router
from app.api.v1.admin import router as admin_router
from app.api.v1.reports import router as reports_router

api_v1_router = APIRouter()

# Mỗi router con đã tự có prefix (vd: /auth, /users) nên không cần prefix ở đây
api_v1_router.include_router(auth_router)
api_v1_router.include_router(scan_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(community_router)
api_v1_router.include_router(knowledge_router)
api_v1_router.include_router(admin_router)
api_v1_router.include_router(reports_router)
