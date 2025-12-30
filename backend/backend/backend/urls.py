"""
URL configuration for backend project.

Main routing file that connects all API endpoints.
Includes authentication, tickets, users, comments, and admin routes.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

# Import views
from tickets.views import (
    TicketViewSet,
    CommentThreadDetailView,
    CommentCreateView,
    ticket_thread_view,
    SLATimeViewSet,
    CommentThreadViewSet,   # NEW
    CommentViewSet,         # NEW
)
from knowledge.views import (
    KnowledgeBaseViewSet,
    CannedResponseViewSet,
)
from users.views import (
    RegisterView,
    CustomTokenObtainPairView,  # Returns user role for frontend routing
    UserViewSet,                # For admin user management
)

# Router for ViewSets
router = DefaultRouter()
router.register(r"tickets", TicketViewSet, basename="ticket")
router.register(r"users", UserViewSet, basename="user")
router.register(r"sla-settings", SLATimeViewSet, basename="sla-setting")
router.register(r"knowledge-base", KnowledgeBaseViewSet, basename="knowledge-base")
router.register(r"canned-responses", CannedResponseViewSet, basename="canned")
router.register(r"comment-threads", CommentThreadViewSet, basename="comment-thread")  # NEW
router.register(r"comments", CommentViewSet, basename="comment")                      # NEW

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # ===== Authentication Endpoints =====
    path("api/auth/register/", RegisterView.as_view(), name="register")
    ,
    path("api/auth/login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # ===== Comment & Thread Legacy Endpoints (optional but safe to keep) =====
    path("api/threads/<int:pk>/", CommentThreadDetailView.as_view(), name="thread-detail"),
    path("api/comments/create/", CommentCreateView.as_view(), name="comment-create-legacy"),

    # ===== Router URLs (Tickets, Users, SLA, KB, Canned, Threads, Comments) =====
    path("api/", include(router.urls)),
]
