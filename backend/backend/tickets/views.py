from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Ticket, SLATime, CommentThread, Comment
from .serializers import (
    TicketSerializer,
    CommentSerializer,
    CommentThreadSerializer,
)


class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == user.ROLE_AGENT or user.is_staff:
            return Ticket.objects.all()
        return Ticket.objects.filter(created_user=user)

    def perform_create(self, serializer):
        """
        Create ticket, attach SLA based on priority, and create its comment thread.
        """
        priority_id = int(self.request.data.get("priority_id", 2))
        sla = SLATime.objects.filter(priority_id=priority_id).first()

        # Save the ticket
        ticket = serializer.save(
            created_user=self.request.user,
            sla_time=sla,
        )

        # Ensure a CommentThread exists for this ticket
        CommentThread.objects.get_or_create(ticket=ticket)


class CommentThreadDetailView(generics.RetrieveAPIView):
    """
    Returns a ticket's full comment thread (for chat view) by thread id.
    """
    queryset = CommentThread.objects.all()
    serializer_class = CommentThreadSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommentCreateView(generics.CreateAPIView):
    """
    Add a new comment to a thread.
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
        return Response({"detail": "Ticket not found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        thread = CommentThread.objects.get(ticket=ticket)
    except CommentThread.DoesNotExist:
        return Response({"detail": "Thread not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = CommentThreadSerializer(thread)
    return Response(serializer.data)
