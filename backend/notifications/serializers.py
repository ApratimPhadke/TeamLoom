"""
Serializers for notifications.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for notifications."""
    actor_name = serializers.CharField(source='actor.get_full_name', read_only=True)
    actor_avatar = serializers.URLField(source='actor.avatar_url', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)
    type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'type_display',
            'title', 'message', 'link',
            'actor_name', 'actor_avatar',
            'group', 'group_name',
            'is_read', 'read_at', 'created_at'
        ]
        read_only_fields = ['id', 'notification_type', 'title', 'message', 'actor_name', 'group', 'created_at']
