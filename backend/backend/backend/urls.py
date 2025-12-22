"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views.
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from tickets.views import (
    TicketViewSet,
    CommentThreadDetailView,
    CommentCreateView,
    ticket_thread_view,   # <-- add this import
)
from users.views import RegisterView

router = DefaultRouter()
router.register(r"tickets", TicketViewSet, basename="ticket")

urlpatterns = [
    path("admin/", admin.site.urls),

    # Auth
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Comment thread + comments
    path("api/threads/<int:pk>/", CommentThreadDetailView.as_view(), name="thread-detail"),
    path("api/comments/", CommentCreateView.as_view(), name="comment-create"),

    # Ticket → thread helper (no serializer change needed)
    path(
        "api/tickets/<int:pk>/thread/",
        ticket_thread_view,
        name="ticket-thread",
    ),

    # Tickets (list/create/detail via router)
    path("api/", include(router.urls)),
]
