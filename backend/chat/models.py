"""
Models for real-time group chat.
"""
from django.conf import settings
from django.db import models


class Message(models.Model):
    """
    Chat message in a group.
    """
    group = models.ForeignKey(
        'groups.Group',
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    
    content = models.TextField()
    
    # Message type for system messages, file shares, etc.
    MESSAGE_TYPE_CHOICES = [
        ('text', 'Text'),
        ('system', 'System'),
        ('file', 'File'),
        ('image', 'Image'),
    ]
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPE_CHOICES, default='text')
    
    # For file/image messages
    file_url = models.URLField(blank=True, null=True)
    file_name = models.CharField(max_length=255, blank=True)
    
    # Reply to another message
    reply_to = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='replies'
    )
    
    # Edit tracking
    is_edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(null=True, blank=True)
    
    # Soft delete
    is_deleted = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'messages'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['group', 'created_at']),
        ]
    
    def __str__(self):
        return f"{self.sender.email} in {self.group.name}: {self.content[:50]}"


class MessageRead(models.Model):
    """
    Track which messages have been read by users.
    """
    message = models.ForeignKey(
        Message,
        on_delete=models.CASCADE,
        related_name='reads'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='read_messages'
    )
    read_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'message_reads'
        unique_together = ['message', 'user']
