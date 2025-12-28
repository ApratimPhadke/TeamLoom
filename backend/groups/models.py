"""
Models for project groups, membership, and join requests.
"""
from django.conf import settings
from django.db import models


class Group(models.Model):
    """
    Project group with skills requirements and capacity limits.
    """
    TYPE_CHOICES = [
        ('student', 'Student Project'),
        ('research', 'Research Project'),
        ('course', 'Course Project'),
        ('hackathon', 'Hackathon Team'),
        ('startup', 'Startup Idea'),
    ]
    
    STATUS_CHOICES = [
        ('forming', 'Forming Team'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    # Basic info
    name = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='student')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='forming')
    
    # Leader/creator
    leader = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='led_groups'
    )
    
    # Capacity
    capacity = models.IntegerField(default=5)
    
    # Skills required - stored as JSONB: [{skill_id: 1, min_proficiency: 3, count_needed: 1}, ...]
    required_skills = models.JSONField(default=list)
    
    # Tags for filtering
    tags = models.JSONField(default=list)  # ["AI", "Web", "Mobile"]
    
    # Optional links
    github_url = models.URLField(blank=True, null=True)
    project_url = models.URLField(blank=True, null=True)
    
    # Visibility
    is_public = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    # Analytics
    view_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'groups'
        ordering = ['-created_at']
        verbose_name = 'Group'
        verbose_name_plural = 'Groups'
    
    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"
    
    @property
    def member_count(self):
        return self.members.count()
    
    @property
    def available_spots(self):
        return max(0, self.capacity - self.member_count)
    
    @property
    def is_full(self):
        return self.member_count >= self.capacity


class GroupMember(models.Model):
    """
    Membership relationship between users and groups.
    """
    ROLE_CHOICES = [
        ('leader', 'Leader'),
        ('member', 'Member'),
        ('viewer', 'Viewer'),
    ]
    
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='members'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='group_memberships'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    
    # Contribution tracking (for future use)
    contribution_score = models.IntegerField(default=0)
    
    # Timestamps
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'group_members'
        unique_together = ['group', 'user']
        ordering = ['role', 'joined_at']
    
    def __str__(self):
        return f"{self.user.email} in {self.group.name} ({self.role})"


class JoinRequest(models.Model):
    """
    Request from a user to join a group.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='join_requests'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='join_requests'
    )
    
    # Request details
    message = models.TextField(blank=True, help_text="Why do you want to join?")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Response from leader
    response_message = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_requests'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'join_requests'
        ordering = ['-created_at']
        # Only one pending request per user per group
        constraints = [
            models.UniqueConstraint(
                fields=['group', 'user'],
                condition=models.Q(status='pending'),
                name='unique_pending_request'
            )
        ]
    
    def __str__(self):
        return f"{self.user.email} -> {self.group.name} ({self.status})"


class LeaveRequest(models.Model):
    """
    Request from a member to leave a group.
    Requires leader approval.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='leave_requests'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='leave_requests'
    )
    
    # Request details
    reason = models.TextField(blank=True, help_text="Reason for leaving")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Response from leader
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_leave_requests'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'leave_requests'
        ordering = ['-created_at']
        # Only one pending leave request per user per group
        constraints = [
            models.UniqueConstraint(
                fields=['group', 'user'],
                condition=models.Q(status='pending'),
                name='unique_pending_leave_request'
            )
        ]
    
    def __str__(self):
        return f"{self.user.email} leaving {self.group.name} ({self.status})"

