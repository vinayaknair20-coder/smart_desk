from django.contrib import admin
from .models import Ticket, SLATime, CommentThread, Comment


@admin.register(SLATime)
class SLATimeAdmin(admin.ModelAdmin):
    list_display = ("priority_id", "sla_time_minutes")


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0


@admin.register(CommentThread)
class CommentThreadAdmin(admin.ModelAdmin):
    inlines = [CommentInline]


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ("id", "subject", "queue", "priority_id", "status", "created_user", "assigned_user", "creation_time")
    list_filter = ("queue", "priority_id", "status")
    search_fields = ("subject", "description")
