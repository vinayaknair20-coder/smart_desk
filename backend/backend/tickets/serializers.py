# tickets/serializers.py - COMPLETE WITH ALL FEATURES + ASSIGNMENT FIX
from rest_framework import serializers
from .models import Ticket, Comment, CommentThread, SLATime


class SLATimeSerializer(serializers.ModelSerializer):
    """Serializer for SLA time settings"""
    priority_display = serializers.CharField(source='get_priority_id_display', read_only=True)
    
    class Meta:
        model = SLATime
        fields = ['id', 'priority_id', 'priority_display', 'sla_time_minutes']


# class KnowledgeBaseSerializer(serializers.ModelSerializer):
#     """Serializer for knowledge base articles"""
#     created_by_username = serializers.CharField(source='created_by.username', read_only=True)
#     
#     class Meta:
#         model = KnowledgeBase
#         fields = ['id', 'title', 'content', 'tags', 'created_at', 'updated_at', 'created_by', 'created_by_username', 'version', 'is_active']
#         read_only_fields = ['created_at', 'updated_at', 'version', 'created_by_username']
# 
# 
# # class CannedResponseSerializer(serializers.ModelSerializer):
# #     """Serializer for canned responses"""
# #     created_by_username = serializers.CharField(source='created_by.username', read_only=True)
# #     
# #     class Meta:
# #         model = CannedResponse
# #         fields = ['id', 'title', 'response_text', 'search_tags', 'created_at', 'updated_at', 'created_by', 'created_by_username']
# #         read_only_fields = ['created_at', 'updated_at', 'created_by_username']


class TicketSerializer(serializers.ModelSerializer):
    """Main ticket serializer with display labels and agent assignment"""
    created_user = serializers.ReadOnlyField(source="created_user.id")
    queue_label = serializers.SerializerMethodField()
    priority_label = serializers.SerializerMethodField()
    status_label = serializers.SerializerMethodField()
    thread_id = serializers.SerializerMethodField()
    
    
    # Allow AI/Backend to populate these (frontend won't send them)
    queue = serializers.IntegerField(required=False)
    priority_id = serializers.IntegerField(required=False)

    class Meta:
        model = Ticket
        fields = "__all__"
        read_only_fields = ["id", "creation_time", "created_user"]

    def get_queue_label(self, obj):
        return obj.get_queue_display()

    def get_priority_label(self, obj):
        return obj.get_priority_id_display()

    def get_status_label(self, obj):
        return obj.get_status_display()
    
    def get_thread_id(self, obj):
        """Return the CommentThread id for this ticket"""
        if hasattr(obj, 'thread'):
            return obj.thread.id
        return None
    
    def to_representation(self, instance):
        """
        Always include assigned_to in response (maps from assigned_user_id)
        """
        data = super().to_representation(instance)
        # Return the assigned user's ID as assigned_to for frontend
        data['assigned_to'] = instance.assigned_user_id
        return data
    
    def update(self, instance, validated_data):
        """
        Custom update method to handle assigned_to -> assigned_user mapping
        """
        from users.models import User
        
        # Handle assigned_to field (maps to assigned_user in model)
        assigned_to = validated_data.pop('assigned_to', serializers.empty)
        if assigned_to is not serializers.empty:
            if assigned_to is None or assigned_to == "":
                instance.assigned_user = None
            else:
                try:
                    instance.assigned_user = User.objects.get(pk=int(assigned_to))
                except User.DoesNotExist:
                    instance.assigned_user = None
        
        # Update all other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for individual comments"""
    user = serializers.ReadOnlyField(source="user.id")

    class Meta:
        model = Comment
        fields = ["id", "thread", "user", "comment_time", "comment", "attachment"]
        read_only_fields = ["id", "user", "comment_time"]


class CommentThreadSerializer(serializers.ModelSerializer):
    """Serializer for comment threads with nested comments"""
    comments = CommentSerializer(many=True, read_only=True)
    ticket_id = serializers.ReadOnlyField(source="ticket.id")

    class Meta:
        model = CommentThread
        fields = ["id", "ticket_id", "comments"]
        read_only_fields = ["id", "ticket_id", "comments"]
