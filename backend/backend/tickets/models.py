# tickets/models.py - COMPLETE WITH ALL FEATURES
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class SLATime(models.Model):
    """SLA time settings per priority level"""
    PRIORITY_HIGH = 1
    PRIORITY_MEDIUM = 2
    PRIORITY_LOW = 3

    PRIORITY_CHOICES = (
        (PRIORITY_HIGH, "High"),
        (PRIORITY_MEDIUM, "Medium"),
        (PRIORITY_LOW, "Low"),
    )

    priority_id = models.PositiveSmallIntegerField(choices=PRIORITY_CHOICES, unique=True)
    sla_time_minutes = models.PositiveIntegerField()  # e.g. 240 for 4 hours

    def __str__(self):
        return f"{self.get_priority_id_display()} - {self.sla_time_minutes} mins"


class KnowledgeBase(models.Model):
    """Self-service knowledge base articles"""
    title = models.CharField(max_length=255)
    content = models.TextField()
    tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated tags")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    version = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'knowledge_base'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class CannedResponse(models.Model):
    """Pre-written response templates for agents"""
    title = models.CharField(max_length=255)
    response_text = models.TextField()
    search_tags = models.CharField(max_length=255, blank=True, help_text="Comma-separated search tags")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='canned_responses')
    
    class Meta:
        db_table = 'canned_responses'
        ordering = ['title']
    
    def __str__(self):
        return self.title


class CommentThread(models.Model):
    """Thread container for ticket comments"""
    ticket = models.OneToOneField(
        "Ticket",
        on_delete=models.CASCADE,
        related_name="thread",
    )

    def __str__(self):
        return f"Thread for ticket {self.ticket_id}"


class Comment(models.Model):
    """Individual comment/message in a thread"""
    thread = models.ForeignKey(
        CommentThread,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    comment_time = models.DateTimeField(auto_now_add=True)
    comment = models.TextField()
    attachment = models.FileField(upload_to="attachments/", null=True, blank=True)

    def __str__(self):
        return f"Comment by {self.user_id} on thread {self.thread_id}"


class Ticket(models.Model):
    """Main ticket model"""
    QUEUE_HR = 1
    QUEUE_IT = 2
    QUEUE_FACILITIES = 3
    QUEUE_OTHER = 4

    QUEUE_CHOICES = (
        (QUEUE_HR, "HR"),
        (QUEUE_IT, "IT"),
        (QUEUE_FACILITIES, "Facilities"),
        (QUEUE_OTHER, "Other"),
    )

    PRIORITY_HIGH = 1
    PRIORITY_MEDIUM = 2
    PRIORITY_LOW = 3

    PRIORITY_CHOICES = (
        (PRIORITY_HIGH, "High"),
        (PRIORITY_MEDIUM, "Medium"),
        (PRIORITY_LOW, "Low"),
    )

    STATUS_OPEN = 1
    STATUS_CLOSED = 2

    STATUS_CHOICES = (
        (STATUS_OPEN, "open"),
        (STATUS_CLOSED, "closed"),
    )

    subject = models.CharField(max_length=255)
    description = models.TextField()
    queue = models.PositiveSmallIntegerField(choices=QUEUE_CHOICES)
    priority_id = models.PositiveSmallIntegerField(choices=PRIORITY_CHOICES)
    creation_time = models.DateTimeField(auto_now_add=True)
    status = models.PositiveSmallIntegerField(
        choices=STATUS_CHOICES,
        default=STATUS_OPEN,
    )
    created_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_tickets",
    )
    assigned_user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_tickets",
    )
    sla_time = models.ForeignKey(
        SLATime,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tickets",
    )

    def __str__(self):
        return f"{self.id} - {self.subject}"
