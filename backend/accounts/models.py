"""
Custom User model for TeamLoom.
Supports multiple roles: student, professor, admin.
"""
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email address is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('email_verified', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model with email authentication and role support.
    """
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('professor', 'Professor'),
        ('admin', 'Admin'),
    ]
    
    # Remove username, use email as primary identifier
    username = None
    email = models.EmailField('Email Address', unique=True)
    
    # Profile fields
    first_name = models.CharField('First Name', max_length=150)
    last_name = models.CharField('Last Name', max_length=150)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    avatar_url = models.URLField('Avatar URL', blank=True, null=True)
    
    # Verification
    email_verified = models.BooleanField('Email Verified', default=False)
    verification_token = models.CharField(max_length=100, blank=True, null=True)
    
    # OAuth fields
    google_id = models.CharField('Google ID', max_length=100, blank=True, null=True, unique=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_active = models.DateTimeField(blank=True, null=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    @property
    def is_student(self):
        return self.role == 'student'
    
    @property
    def is_professor(self):
        return self.role == 'professor'
