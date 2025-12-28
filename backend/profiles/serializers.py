"""
Serializers for profiles and skills.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Skill, StudentProfile, ProfileView

User = get_user_model()


class SkillSerializer(serializers.ModelSerializer):
    """Serializer for skill taxonomy."""
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'category_display', 'description', 'icon']


class SkillEntrySerializer(serializers.Serializer):
    """Serializer for skill entries in profile."""
    skill_id = serializers.IntegerField()
    proficiency = serializers.IntegerField(min_value=1, max_value=5)
    
    def validate_skill_id(self, value):
        if not Skill.objects.filter(id=value).exists():
            raise serializers.ValidationError('Invalid skill ID')
        return value


class StudentProfileSerializer(serializers.ModelSerializer):
    """Serializer for student profiles."""
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    full_name = serializers.SerializerMethodField()
    avatar_url = serializers.URLField(source='user.avatar_url', read_only=True)
    skills_detail = serializers.SerializerMethodField()
    year_display = serializers.CharField(source='get_year_display', read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = [
            'id', 'user_id', 'email', 'first_name', 'last_name', 'full_name', 'avatar_url',
            'department', 'year', 'year_display', 'student_id',
            'skills', 'skills_detail',
            'github_url', 'linkedin_url', 'portfolio_url', 'resume_url',
            'bio', 'tagline',
            'looking_for_team', 'open_to_mentorship',
            'view_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user_id', 'view_count', 'created_at', 'updated_at']
    
    def get_full_name(self, obj):
        return obj.user.get_full_name()
    
    def get_skills_detail(self, obj):
        """Get detailed skill information."""
        return obj.get_skill_names()
    
    def validate_skills(self, value):
        """Validate skills format."""
        if not isinstance(value, list):
            raise serializers.ValidationError('Skills must be a list')
        
        for entry in value:
            serializer = SkillEntrySerializer(data=entry)
            serializer.is_valid(raise_exception=True)
        
        return value


class StudentProfileListSerializer(serializers.ModelSerializer):
    """Compact serializer for profile lists."""
    full_name = serializers.SerializerMethodField()
    avatar_url = serializers.URLField(source='user.avatar_url', read_only=True)
    skills_detail = serializers.SerializerMethodField()
    year_display = serializers.CharField(source='get_year_display', read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = [
            'id', 'full_name', 'avatar_url',
            'department', 'year', 'year_display',
            'skills_detail', 'tagline',
            'looking_for_team', 'view_count'
        ]
    
    def get_full_name(self, obj):
        return obj.user.get_full_name()
    
    def get_skills_detail(self, obj):
        return obj.get_skill_names()[:5]  # Limit to first 5 skills


class ProfileViewSerializer(serializers.ModelSerializer):
    """Serializer for profile views."""
    viewer_name = serializers.CharField(source='viewer.get_full_name', read_only=True)
    viewer_avatar = serializers.URLField(source='viewer.avatar_url', read_only=True)
    
    class Meta:
        model = ProfileView
        fields = ['id', 'viewer', 'viewer_name', 'viewer_avatar', 'viewed_at']
