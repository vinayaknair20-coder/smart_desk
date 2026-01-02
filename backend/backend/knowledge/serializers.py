from rest_framework import serializers
from .models import KnowledgeBase, CannedResponse, FAQ

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'order', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class KnowledgeBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeBase
        fields = ['id', 'title', 'content', 'tags', 'created_at', 'updated_at', 'created_by', 'version', 'is_active']
        extra_kwargs = {
            'embedding': {'read_only': True},
            'rag_data': {'read_only': True},
            'created_by': {'read_only': True},
            'version': {'read_only': True}
        }

class CannedResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CannedResponse
        fields = '__all__'
        extra_kwargs = {
            'created_by': {'read_only': True}
        }
