from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response

from .models import Ticket, SLATime, CommentThread, Comment #, KnowledgeBase, CannedResponse
from .serializers import (
    TicketSerializer,
    CommentSerializer,
    CommentThreadSerializer,
    SLATimeSerializer,
    # KnowledgeBaseSerializer,
    # CannedResponseSerializer,
)
from .ai_classifier import classify_ticket  # NEW: Import auto-classifier
from .email_service import (
    send_ticket_created_notification,
    send_ticket_assigned_notification,
    send_ticket_status_changed_notification,
    send_comment_added_notification
)


from .analytics import calculate_sla_compliance, calculate_fcr_rate, get_workload_stats

class TicketViewSet(viewsets.ModelViewSet):
    """
    List/create/update tickets.
    Users see only their tickets, agents/admins see all.
    """
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        """Returns dashboard analytics metrics."""
        # Only admins/agents can see analytics 
        if request.user.role not in [1, 3] and not request.user.is_staff:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
            
        data = {
            "sla_compliance": calculate_sla_compliance(),
            "fcr_rate": calculate_fcr_rate(),
            "agent_workload": get_workload_stats(),
            "total_tickets": Ticket.objects.count(),
            "open_tickets": Ticket.objects.filter(status=1).count(),
            "closed_tickets": Ticket.objects.filter(status=2).count(),
        }
        return Response(data)

    def get_queryset(self):
        user = self.request.user
        if user.role == user.ROLE_AGENT or user.role == user.ROLE_ADMIN or user.is_staff:
            return Ticket.objects.all()
        return Ticket.objects.filter(created_user=user)

    def perform_create(self, serializer):
        """
        Create ticket with SMART auto-classification.
        Automatically determines queue and priority based on content.
        """
        subject = self.request.data.get("subject", "")
        description = self.request.data.get("description", "")
        
        # 🤖 SMART AUTO-CLASSIFICATION
        ai_result = classify_ticket(subject, description)
        
        # Use auto-classification results
        queue = ai_result["queue"]
        priority_id = ai_result["priority"]
        
        # Get SLA based on auto-assigned priority
        sla = SLATime.objects.filter(priority_id=priority_id).first()

        ticket = serializer.save(
            created_user=self.request.user,
            queue=queue,
            priority_id=priority_id,
            sla_time=sla,
        )

        # Ensure each ticket has a thread
        CommentThread.objects.get_or_create(ticket=ticket)
        
        # Log classification for monitoring (shows in Django terminal)
        print(f"✅ Ticket #{ticket.id} auto-classified:")
        print(f"   Subject: {subject[:50]}...")
        print(f"   Queue: {queue} | Priority: {priority_id}")
        print(f"   Reasoning: {ai_result['reasoning']}")
        
        # 📧 Send email notification to user
        try:
            send_ticket_created_notification(ticket, self.request.user.email)
            print(f"   📧 Email sent to {self.request.user.email}")
        except Exception as e:
            print(f"   ⚠️ Email failed: {e}")
    
    def update(self, request, *args, **kwargs):
        """Override update to send emails on assignment/status changes"""
        instance = self.get_object()
        old_status = instance.status
        old_assigned = instance.assigned_user
        
        # Perform the update
        response = super().update(request, *args, **kwargs)
        instance.refresh_from_db()
        
        # Check if status changed
        if old_status != instance.status:
            try:
                send_ticket_status_changed_notification(
                    instance, 
                    instance.created_user.email,
                    old_status,
                    instance.status
                )
                print(f"📧 Status change email sent to {instance.created_user.email}")
            except Exception as e:
                print(f"⚠️ Status email failed: {e}")
        
        # Check if assigned_user changed
        if old_assigned != instance.assigned_user and instance.assigned_user:
            try:
                send_ticket_assigned_notification(instance, instance.assigned_user)
                print(f"📧 Assignment email sent to {instance.assigned_user.email}")
            except Exception as e:
                print(f"⚠️ Assignment email failed: {e}")
        
        return response


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


# class KnowledgeBaseViewSet(viewsets.ModelViewSet):
#     """
#     CRUD for knowledge base articles.
#     Public can read, authenticated users can create/edit.
#     """
#     queryset = KnowledgeBase.objects.filter(is_active=True)
#     serializer_class = KnowledgeBaseSerializer
# 
#     def get_permissions(self):
#         if self.action in ["list", "retrieve"]:
#             return [permissions.AllowAny()]
#         return [permissions.IsAuthenticated()]
# 
#     def perform_create(self, serializer):
#         serializer.save(created_by=self.request.user)
# 
# 
# class CannedResponseViewSet(viewsets.ModelViewSet):
#     """
#     CRUD for canned responses.
#     Agents and admins can use.
#     """
#     queryset = CannedResponse.objects.all()
#     serializer_class = CannedResponseSerializer
#     permission_classes = [permissions.IsAuthenticated]
# 
#     def perform_create(self, serializer):
#         serializer.save(created_by=self.request.user)


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
        comment = serializer.save(user=self.request.user)
        
        # 📧 Send email notification when comment is added
        try:
            # Get the ticket from the comment thread
            thread = comment.thread
            ticket = thread.ticket
            
            # Send to ticket creator if commenter is not the creator
            if comment.user != ticket.created_user:
                send_comment_added_notification(
                    ticket, 
                    comment, 
                    ticket.created_user.email,
                    ticket.created_user.username
                )
                print(f"📧 Comment notification sent to {ticket.created_user.email}")
            
            # Send to assigned agent if commenter is not the agent and ticket is assigned
            if ticket.assigned_user and comment.user != ticket.assigned_user:
                send_comment_added_notification(
                    ticket,
                    comment,
                    ticket.assigned_user.email,
                    ticket.assigned_user.username
                )
                print(f"📧 Comment notification sent to {ticket.assigned_user.email}")
                
        except Exception as e:
            print(f"⚠️ Comment email failed: {e}")


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
