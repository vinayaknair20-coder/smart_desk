from django.db import models
from django.conf import settings
import json

class KnowledgeBase(models.Model):
    """
    Knowledge Base Article with AI Embeddings for Semantic Search.
    """
    title = models.CharField(max_length=255)
    content = models.TextField(help_text="Full article content")
    rag_data = models.TextField(blank=True, null=True, help_text="Optimized content for AI context (optional)")
    tags = models.CharField(max_length=255, blank=True)
    
    # Store vector embedding as a list of floats (JSON)
    embedding = models.JSONField(blank=True, null=True, help_text="Gemini AI Vector Embedding")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='kb_articles')
    version = models.IntegerField(default=1)

    def __str__(self):
        return self.title
    
    def set_embedding(self, vector):
        self.embedding = vector

    def get_embedding(self):
        return self.embedding


class CannedResponse(models.Model):
    # Predefined text scripts for agent comments
    title = models.CharField(max_length=255, default="New Response")
    response_text = models.TextField()
    search_tags = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='kw_canned_responses')

    def __str__(self):
        return self.title
