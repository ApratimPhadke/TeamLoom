from django.contrib import admin
from .models import Skill, StudentProfile, ProfileView


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'description']
    ordering = ['category', 'name']


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'department', 'year', 'looking_for_team', 'view_count']
    list_filter = ['department', 'year', 'looking_for_team']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'department']
    raw_id_fields = ['user']


@admin.register(ProfileView)
class ProfileViewAdmin(admin.ModelAdmin):
    list_display = ['profile', 'viewer', 'viewed_at']
    list_filter = ['viewed_at']
    raw_id_fields = ['profile', 'viewer']
