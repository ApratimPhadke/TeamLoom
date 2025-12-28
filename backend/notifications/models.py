"""
Models for in-app notifications.
"""
from django.conf import settings
from django.db import models


class Notification(models.Model):
    """
    In-app notification for users.
    """
    TYPE_CHOICES = [
        ('join_request', 'Join Request'),
        ('request_accepted', 'Request Accepted'),
        ('request_rejected', 'Request Rejected'),
        ('new_member', 'New Member'),
        ('member_left', 'Member Left'),
        ('new_message', 'New Message'),
        ('mention', 'Mention'),
        ('profile_view', 'Profile View'),
        ('group_update', 'Group Update'),
        ('system', 'System'),
    ]
    
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    
    notification_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    # Optional related objects
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='triggered_notifications'
    )
    group = models.ForeignKey(
        'groups.Group',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )
    
    # Link to related object
    link = models.CharField(max_length=500, blank=True)
    
    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Email sent status
    email_sent = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.notification_type} for {self.recipient.email}: {self.title}"
