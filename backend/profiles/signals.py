"""
Signals for creating student profiles automatically.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import StudentProfile


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_student_profile(sender, instance, created, **kwargs):
    """Create a student profile when a new student user is created."""
    if created and instance.role == 'student':
        StudentProfile.objects.create(
            user=instance,
            department='',
            year=1
        )
