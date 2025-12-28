"""
API views for profiles and skills management.
"""
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

from .models import Skill, StudentProfile, ProfileView
from .serializers import (
    SkillSerializer,
    StudentProfileSerializer,
    StudentProfileListSerializer,
    ProfileViewSerializer,
)


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List all skills in the taxonomy.
    
    GET /api/profiles/skills/
    GET /api/profiles/skills/{id}/
    """
    queryset = Skill.objects.filter(is_active=True)
    serializer_class = SkillSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # Return all skills without pagination
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get skills grouped by category."""
        skills = Skill.objects.filter(is_active=True).order_by('category', 'name')
        grouped = {}
        for skill in skills:
            category = skill.get_category_display()
            if category not in grouped:
                grouped[category] = []
            grouped[category].append(SkillSerializer(skill).data)
        return Response(grouped)


class MyProfileView(generics.RetrieveUpdateAPIView):
    """
    Get or update current user's profile.
    
    GET /api/profiles/me/
    PUT/PATCH /api/profiles/me/
    """
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = StudentProfile.objects.get_or_create(
            user=self.request.user,
            defaults={'department': '', 'year': 1}
        )
        return profile


class StudentProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    View and search student profiles.
    
    GET /api/profiles/students/
    GET /api/profiles/students/{id}/
    """
    queryset = StudentProfile.objects.select_related('user').filter(
        user__is_active=True,
        looking_for_team=True
    )
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['department', 'year', 'looking_for_team']
    search_fields = ['user__first_name', 'user__last_name', 'department', 'bio', 'tagline']
    ordering_fields = ['view_count', 'created_at', 'year']
    ordering = ['-view_count']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return StudentProfileListSerializer
        return StudentProfileSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Track profile view (except for own profile)
        if instance.user != request.user:
            ProfileView.objects.create(
                profile=instance,
                viewer=request.user
            )
            # Increment view count
            instance.view_count += 1
            instance.save(update_fields=['view_count'])
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_skills(self, request):
        """
        Filter profiles by skills.
        
        GET /api/profiles/students/by_skills/?skills=1,2,3
        """
        skill_ids = request.query_params.get('skills', '')
        if not skill_ids:
            return Response([])
        
        skill_ids = [int(x) for x in skill_ids.split(',') if x.isdigit()]
        
        # Filter profiles that have at least one of the specified skills
        profiles = self.get_queryset()
        matching = []
        for profile in profiles:
            profile_skill_ids = [s.get('skill_id') for s in profile.skills]
            if any(sid in profile_skill_ids for sid in skill_ids):
                matching.append(profile)
        
        serializer = StudentProfileListSerializer(matching[:20], many=True)
        return Response(serializer.data)


class ProfileViewsView(generics.ListAPIView):
    """
    Get list of users who viewed your profile.
    
    GET /api/profiles/views/
    """
    serializer_class = ProfileViewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        try:
            profile = self.request.user.student_profile
            # Get views from last 30 days
            cutoff = timezone.now() - timedelta(days=30)
            return ProfileView.objects.filter(
                profile=profile,
                viewed_at__gte=cutoff
            ).select_related('viewer').order_by('-viewed_at')[:50]
        except StudentProfile.DoesNotExist:
            return ProfileView.objects.none()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Add summary stats
        try:
            profile = request.user.student_profile
            today_count = ProfileView.objects.filter(
                profile=profile,
                viewed_at__date=timezone.now().date()
            ).count()
            total_count = profile.view_count
        except StudentProfile.DoesNotExist:
            today_count = 0
            total_count = 0
        
        return Response({
            'today_views': today_count,
            'total_views': total_count,
            'recent_views': serializer.data
        })
