from django.contrib import admin
from .models import Group, GroupMember, JoinRequest


class GroupMemberInline(admin.TabularInline):
    model = GroupMember
    extra = 0
    raw_id_fields = ['user']


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'status', 'leader', 'capacity', 'member_count', 'is_featured']
    list_filter = ['type', 'status', 'is_featured', 'is_public']
    search_fields = ['name', 'description', 'leader__email']
    raw_id_fields = ['leader']
    inlines = [GroupMemberInline]
    
    def member_count(self, obj):
        return obj.members.count()
    member_count.short_description = 'Members'


@admin.register(JoinRequest)
class JoinRequestAdmin(admin.ModelAdmin):
    list_display = ['user', 'group', 'status', 'created_at', 'reviewed_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__email', 'group__name']
    raw_id_fields = ['user', 'group', 'reviewed_by']
