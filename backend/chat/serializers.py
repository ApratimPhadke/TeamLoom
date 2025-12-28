"""
Serializers for chat messages.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Message, MessageRead

User = get_user_model()


class SenderSerializer(serializers.ModelSerializer):
    """Minimal sender info for messages."""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'full_name', 'avatar_url']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for chat messages."""
    sender = SenderSerializer(read_only=True)
    reply_to_preview = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = [
            'id', 'group', 'sender', 'content', 'message_type',
            'file_url', 'file_name', 'reply_to', 'reply_to_preview',
            'is_edited', 'edited_at', 'is_deleted', 'created_at'
        ]
        read_only_fields = ['id', 'sender', 'is_edited', 'edited_at', 'is_deleted', 'created_at']
    
    def get_reply_to_preview(self, obj):
        if obj.reply_to and not obj.reply_to.is_deleted:
            return {
                'id': obj.reply_to.id,
                'sender_name': obj.reply_to.sender.get_full_name(),
                'content': obj.reply_to.content[:100]
            }
        return None


class MessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating messages."""
    
    class Meta:
        model = Message
        fields = ['content', 'message_type', 'file_url', 'file_name', 'reply_to']
    
    def validate_reply_to(self, value):
        if value:
            group = self.context.get('group')
            if value.group_id != group.id:
                raise serializers.ValidationError('Cannot reply to message from another group')
        return value


class MessageListSerializer(serializers.ModelSerializer):
    """Compact message serializer for listings."""
    sender_id = serializers.IntegerField(source='sender.id', read_only=True)
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    sender_avatar = serializers.URLField(source='sender.avatar_url', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 'sender_id', 'sender_name', 'sender_avatar',
            'content', 'message_type', 'is_edited', 'is_deleted', 'created_at'
        ]

