from django.contrib import admin
from .models import KnowledgeBase, CannedResponse


@admin.register(KnowledgeBase)
class KnowledgeBaseAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "tags")
    search_fields = ("title", "tags", "rag_data")


@admin.register(CannedResponse)
class CannedResponseAdmin(admin.ModelAdmin):
    list_display = ("id", "search_tags")
    search_fields = ("search_tags", "canned_response")
