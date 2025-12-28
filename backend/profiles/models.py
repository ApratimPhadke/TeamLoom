"""
Models for student profiles, skills taxonomy, and profile analytics.
"""
from django.conf import settings
from django.db import models


class Skill(models.Model):
    """
    Skill taxonomy for categorizing student abilities.
    """
    CATEGORY_CHOICES = [
        ('programming', 'Programming Languages'),
        ('web', 'Web Development'),
        ('mobile', 'Mobile Development'),
        ('data', 'Data Science & ML'),
        ('hardware', 'Hardware & Embedded'),
        ('design', 'Design & UI/UX'),
        ('devops', 'DevOps & Cloud'),
        ('database', 'Databases'),
        ('tools', 'Tools & Frameworks'),
        ('soft', 'Soft Skills'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # Icon name for frontend
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'skills'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class StudentProfile(models.Model):
    """
    Extended profile for student users with skills and portfolio links.
    """
    YEAR_CHOICES = [
        (1, '1st Year'),
        (2, '2nd Year'),
        (3, '3rd Year'),
        (4, '4th Year'),
        (5, 'Post-Graduate'),
    ]
    
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    
    # Academic info
    department = models.CharField(max_length=100)
    year = models.IntegerField(choices=YEAR_CHOICES)
    student_id = models.CharField(max_length=50, blank=True)
    
    # Skills - stored as JSONB: [{skill_id: 1, proficiency: 4}, ...]
    skills = models.JSONField(default=list)
    
    # Portfolio links
    github_url = models.URLField('GitHub URL', blank=True, null=True)
    linkedin_url = models.URLField('LinkedIn URL', blank=True, null=True)
    portfolio_url = models.URLField('Portfolio URL', blank=True, null=True)
    resume_url = models.URLField('Resume URL', blank=True, null=True)
    
    # Bio
    bio = models.TextField(max_length=500, blank=True)
    tagline = models.CharField(max_length=150, blank=True)  # Short description
    
    # Availability
    looking_for_team = models.BooleanField(default=True)
    open_to_mentorship = models.BooleanField(default=False)
    
    # Analytics
    view_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'student_profiles'
        verbose_name = 'Student Profile'
        verbose_name_plural = 'Student Profiles'
    
    def __str__(self):
        return f"{self.user.get_full_name()} - {self.department} (Year {self.year})"
    
    def get_skill_objects(self):
        """Get actual Skill objects for this profile."""
        skill_ids = [s['skill_id'] for s in self.skills if 'skill_id' in s]
        return Skill.objects.filter(id__in=skill_ids)
    
    def get_skill_names(self):
        """Get list of skill names with proficiency."""
        skills_data = []
        for skill_entry in self.skills:
            try:
                skill = Skill.objects.get(id=skill_entry.get('skill_id'))
                skills_data.append({
                    'name': skill.name,
                    'category': skill.category,
                    'proficiency': skill_entry.get('proficiency', 1)
                })
            except Skill.DoesNotExist:
                continue
        return skills_data


class ProfileView(models.Model):
    """
    Track who viewed a student's profile and when.
    """
    profile = models.ForeignKey(
        StudentProfile,
        on_delete=models.CASCADE,
        related_name='profile_views'
    )
    viewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='viewed_profiles'
    )
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'profile_views'
        ordering = ['-viewed_at']
        # Allow multiple views but track each one
    
    def __str__(self):
        return f"{self.viewer.email} viewed {self.profile.user.email} on {self.viewed_at}"
