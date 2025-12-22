from django.db import models


class KnowledgeBase(models.Model):
    # For RAG response for user search before ticket creation
    title = models.CharField(max_length=255)
    rag_data = models.TextField()  # raw KB content for embeddings
    tags = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.title


class CannedResponse(models.Model):
    # Predefined text scripts for agent comments
    search_tags = models.CharField(max_length=255)
    canned_response = models.TextField()

    def __str__(self):
        return self.search_tags
