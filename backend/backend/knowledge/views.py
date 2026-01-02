from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import KnowledgeBase, CannedResponse, FAQ
from .serializers import KnowledgeBaseSerializer, CannedResponseSerializer, FAQSerializer
from .utils import generate_embedding, generate_query_embedding
import numpy as np

class FAQViewSet(viewsets.ModelViewSet):
    """
    CRUD for FAQs.
    Public read access for landing page. Admin write access.
    """
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_staff:
            return FAQ.objects.all()
        return FAQ.objects.filter(is_active=True)

class KnowledgeBaseViewSet(viewsets.ModelViewSet):
    """
    CRUD for knowledge base articles.
    Public can read, authenticated users can create/edit.
    """
    queryset = KnowledgeBase.objects.filter(is_active=True)
    serializer_class = KnowledgeBaseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action == 'search':
            return [permissions.AllowAny()]
        return super().get_permissions()

    def perform_create(self, serializer):
        # Auto-generate embedding on create
        instance = serializer.save(created_by=self.request.user)
        
        # Combine title and content for embedding
        full_text = f"{instance.title}\n\n{instance.content}"
        embedding = generate_embedding(full_text)
        
        if embedding:
            instance.set_embedding(embedding)
            instance.save()
            print(f"✅ Embedding generated for article: {instance.title}")
        else:
            print(f"⚠️ Failed to generate embedding for: {instance.title}")

    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Semantic search endpoint.
        """
        query = request.query_params.get('q', None)
        if not query:
            return Response({"error": "No query provided"}, status=status.HTTP_400_BAD_REQUEST)

        from .utils import semantic_search
        results = semantic_search(query)
        
        serializer = self.get_serializer(results, many=True)
        return Response({
            "mode": "semantic",
            "results": serializer.data
        })

    @action(detail=False, methods=['get'])
    def suggest(self, request):
        """
        Fast autocomplete suggestions.
        """
        query = request.query_params.get('q', '')
        if len(query) < 2:
            return Response([])

        results = KnowledgeBase.objects.filter(
            Q(title__icontains=query) | Q(tags__icontains=query),
            is_active=True
        ).only('id', 'title')[:5]

        # Use a simple list of dicts for suggestions to keep it fast
        suggestions = [{"id": r.id, "title": r.title} for r in results]
        return Response(suggestions)

class CannedResponseViewSet(viewsets.ModelViewSet):
    """
    CRUD for canned responses.
    """
    queryset = CannedResponse.objects.all()
    serializer_class = CannedResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
