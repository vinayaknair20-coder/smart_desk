# tickets/views.py - COMPLETE WITH ALL FEATURES + COMMENT VIEWSETS
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Ticket, SLATime, CommentThread, Comment, KnowledgeBase, CannedResponse
from .serializers import (
    TicketSerializer,
    CommentSerializer,
    CommentThreadSerializer,
    SLATimeSerializer,
    KnowledgeBaseSerializer,
    CannedResponseSerializer,
)


class TicketViewSet(viewsets.ModelViewSet):
    """
    List/create/update tickets.
    Users see only their tickets, agents/admins see all.
    """
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        user = self.request.user
        if user.role == user.ROLE_AGENT or user.role == user.ROLE_ADMIN or user.is_staff:
            return Ticket.objects.all()
        return Ticket.objects.filter(created_user=user)

    def perform_create(self, serializer):
        """
        Create ticket, attach SLA based on priority, and create its comment thread.
        """
        priority_id = int(self.request.data.get("priority_id", 2))
        sla = SLATime.objects.filter(priority_id=priority_id).first()

        ticket = serializer.save(
            created_user=self.request.user,
            sla_time=sla,
        )

        # Ensure each ticket has a thread
        CommentThread.objects.get_or_create(ticket=ticket)


class SLATimeViewSet(viewsets.ModelViewSet):
    """
    CRUD for SLA time settings.
    Only admins can modify, everyone can read.
    """
    queryset = SLATime.objects.all()
    serializer_class = SLATimeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]


class KnowledgeBaseViewSet(viewsets.ModelViewSet):
    """
    CRUD for knowledge base articles.
    Public can read, authenticated users can create/edit.
    """
    queryset = KnowledgeBase.objects.filter(is_active=True)
    serializer_class = KnowledgeBaseSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class CannedResponseViewSet(viewsets.ModelViewSet):
    """
    CRUD for canned responses.
    Agents and admins can use.
    """
    queryset = CannedResponse.objects.all()
    serializer_class = CannedResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# ===== NEW: Proper REST viewsets for threads & comments =====

class CommentThreadViewSet(viewsets.ModelViewSet):
    """
    ViewSet for comment threads.
    Used at /api/comment-threads/<id>/
    """
    queryset = CommentThread.objects.all()
    serializer_class = CommentThreadSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for individual comments.
    Used at /api/comments/
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the user to the logged-in user
        serializer.save(user=self.request.user)


# ===== Legacy helpers (still OK to keep for convenience) =====

class CommentThreadDetailView(generics.RetrieveAPIView):
    """
    Returns a ticket's full comment thread (for chat view) by thread id.
    (Kept for backward compatibility: /api/threads/<id>/)
    """
    queryset = CommentThread.objects.all()
    serializer_class = CommentThreadSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommentCreateView(generics.CreateAPIView):
    """
    Add a new comment to a thread.
    (Kept for backward compatibility: POST /api/comments/)
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def ticket_thread_view(request, pk):
    """
    Return the CommentThread for a given ticket id (pk).
    Used by frontend: GET /api/tickets/<pk>/thread/
    """
    try:
        ticket = Ticket.objects.get(pk=pk)
    except Ticket.DoesNotExist:
        return Response(
            {"detail": "Ticket not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        thread = CommentThread.objects.get(ticket=ticket)
    except CommentThread.DoesNotExist:
        return Response(
            {"detail": "Thread not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = CommentThreadSerializer(thread)
    return Response(serializer.data)
