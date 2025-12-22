from rest_framework import serializers
from .models import Ticket, Comment, CommentThread


class TicketSerializer(serializers.ModelSerializer):
    created_user = serializers.ReadOnlyField(source="created_user.id")
    thread_id = serializers.ReadOnlyField(source="thread.id")

    class Meta:
        model = Ticket
        fields = "__all__"  # already includes everything else
        read_only_fields = ["id", "creation_time", "created_user", "thread_id"]

        

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.id")

    class Meta:
        model = Comment
        fields = ["id", "thread", "user", "comment_time", "comment", "attachment"]
        read_only_fields = ["id", "comment_time", "user"]


class CommentThreadSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = CommentThread
        fields = ["id", "ticket", "comments"]
