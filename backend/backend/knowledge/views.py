from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import KnowledgeBase, CannedResponse
from .serializers import KnowledgeBaseSerializer, CannedResponseSerializer
from .utils import generate_embedding, generate_query_embedding
import numpy as np

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
        GET /api/knowledge/search/?q=how to fix vpn
        """
        query = request.query_params.get('q', None)
        if not query:
            return Response({"error": "No query provided"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Generate embedding for query
        query_vec = generate_query_embedding(query)
        if not query_vec:
            # Fallback to simple database search
            results = self.queryset.filter(title__icontains=query) | self.queryset.filter(content__icontains=query)
            serializer = self.get_serializer(results[:5], many=True)
            return Response({
                "mode": "keyword_fallback", 
                "results": serializer.data
            })

        # 2. Vector Search (Cosine Similarity)
        # Load all active articles with embeddings
        articles = [a for a in self.queryset if a.embedding]
        
        if not articles:
             return Response({"mode": "empty", "results": []})

        scored_results = []
        q_vec = np.array(query_vec)
        
        for article in articles:
            a_vec = np.array(article.embedding)
            
            # Cosine Similarity: (A . B) / (||A|| * ||B||)
            dot_product = np.dot(q_vec, a_vec)
            norm_q = np.linalg.norm(q_vec)
            norm_a = np.linalg.norm(a_vec)
            
            similarity = dot_product / (norm_q * norm_a)
            scored_results.append((similarity, article))
            
        # Sort by similarity (highest first)
        scored_results.sort(key=lambda x: x[0], reverse=True)
        
        # Top 5
        top_results = [item[1] for item in scored_results[:5]]
        
        serializer = self.get_serializer(top_results, many=True)
        return Response({
            "mode": "semantic",
            "results": serializer.data
        })

class CannedResponseViewSet(viewsets.ModelViewSet):
    """
    CRUD for canned responses.
    """
    queryset = CannedResponse.objects.all()
    serializer_class = CannedResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
