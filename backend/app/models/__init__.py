"""
ORM models package. Import all models here so that
`Base.metadata.create_all()` discovers them automatically.
"""

from app.models.user import User, FamilyLink          # noqa: F401
from app.models.scan import ScanResult                 # noqa: F401
from app.models.community import CommunityPost, PostComment, PostVote  # noqa: F401
from app.models.knowledge import KnowledgeArticle     # noqa: F401
from app.models.audit import AuditLog                  # noqa: F401
