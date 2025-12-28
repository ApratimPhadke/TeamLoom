"""
Serializers for groups and join requests.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Group, GroupMember, JoinRequest
from profiles.models import Skill
from profiles.serializers import StudentProfileListSerializer

User = get_user_model()


class UserMinimalSerializer(serializers.ModelSerializer):
    """Minimal user info for member lists."""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'avatar_url']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class GroupMemberSerializer(serializers.ModelSerializer):
    """Serializer for group members."""
    user = UserMinimalSerializer(read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
    class Meta:
        model = GroupMember
        fields = ['id', 'user', 'role', 'role_display', 'contribution_score', 'joined_at']


class RequiredSkillSerializer(serializers.Serializer):
    """Serializer for required skills in groups."""
    skill_id = serializers.IntegerField()
    min_proficiency = serializers.IntegerField(min_value=1, max_value=5, default=1)
    count_needed = serializers.IntegerField(min_value=1, default=1)
    
    def validate_skill_id(self, value):
        if not Skill.objects.filter(id=value).exists():
            raise serializers.ValidationError('Invalid skill ID')
        return value


class GroupSerializer(serializers.ModelSerializer):
    """Full group serializer."""
    leader = UserMinimalSerializer(read_only=True)
    members = GroupMemberSerializer(many=True, read_only=True)
    member_count = serializers.IntegerField(read_only=True)
    available_spots = serializers.IntegerField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    required_skills_detail = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    has_pending_request = serializers.SerializerMethodField()
    
    class Meta:
        model = Group
        fields = [
            'id', 'name', 'description', 'type', 'type_display',
            'status', 'status_display',
            'leader', 'capacity', 'member_count', 'available_spots', 'is_full',
            'required_skills', 'required_skills_detail',
            'tags', 'github_url', 'project_url',
            'is_public', 'is_featured', 'view_count',
            'members', 'is_member', 'has_pending_request',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'leader', 'view_count', 'created_at', 'updated_at']
    
    def get_required_skills_detail(self, obj):
        """Get detailed skill info for required skills."""
        skills_data = []
        for req in obj.required_skills:
            try:
                skill = Skill.objects.get(id=req.get('skill_id'))
                skills_data.append({
                    'skill_id': skill.id,
                    'name': skill.name,
                    'category': skill.category,
                    'min_proficiency': req.get('min_proficiency', 1),
                    'count_needed': req.get('count_needed', 1)
                })
            except Skill.DoesNotExist:
                continue
        return skills_data
    
    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(user=request.user).exists()
        return False
    
    def get_has_pending_request(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.join_requests.filter(user=request.user, status='pending').exists()
        return False
    
    def validate_required_skills(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('Required skills must be a list')
        for entry in value:
            serializer = RequiredSkillSerializer(data=entry)
            serializer.is_valid(raise_exception=True)
        return value


class GroupListSerializer(serializers.ModelSerializer):
    """Compact group serializer for listings."""
    leader_name = serializers.CharField(source='leader.get_full_name', read_only=True)
    leader_avatar = serializers.URLField(source='leader.avatar_url', read_only=True)
    member_count = serializers.IntegerField(read_only=True)
    available_spots = serializers.IntegerField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    status = serializers.CharField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    required_skills_detail = serializers.SerializerMethodField()
    
    class Meta:
        model = Group
        fields = [
            'id', 'name', 'description', 'type', 'type_display',
            'status', 'status_display',
            'leader_name', 'leader_avatar',
            'capacity', 'member_count', 'available_spots', 'is_full',
            'required_skills_detail', 'tags',
            'is_featured', 'view_count', 'created_at'
        ]
    
    def get_required_skills_detail(self, obj):
        skills_data = []
        for req in obj.required_skills[:5]:  # Limit to 5 skills in list view
            try:
                skill = Skill.objects.get(id=req.get('skill_id'))
                skills_data.append({
                    'name': skill.name,
                    'min_proficiency': req.get('min_proficiency', 1)
                })
            except Skill.DoesNotExist:
                continue
        return skills_data


class GroupCreateSerializer(serializers.ModelSerializer):
    """Serializer for group creation."""
    
    class Meta:
        model = Group
        fields = [
            'name', 'description', 'type', 'capacity',
            'required_skills', 'tags',
            'github_url', 'project_url', 'is_public'
        ]
    
    def validate_required_skills(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('Required skills must be a list')
        for entry in value:
            serializer = RequiredSkillSerializer(data=entry)
            serializer.is_valid(raise_exception=True)
        return value
    
    def create(self, validated_data):
        user = self.context['request'].user
        group = Group.objects.create(leader=user, **validated_data)
        # Add leader as member
        GroupMember.objects.create(group=group, user=user, role='leader')
        return group


class JoinRequestSerializer(serializers.ModelSerializer):
    """Serializer for join requests."""
    user = UserMinimalSerializer(read_only=True)
    user_profile = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = JoinRequest
        fields = [
            'id', 'group', 'user', 'user_profile',
            'message', 'status', 'status_display',
            'response_message', 'reviewed_by',
            'created_at', 'reviewed_at'
        ]
        read_only_fields = ['id', 'group', 'user', 'reviewed_by', 'created_at', 'reviewed_at']
    
    def get_user_profile(self, obj):
        try:
            profile = obj.user.student_profile
            return StudentProfileListSerializer(profile).data
        except:
            return None


class JoinRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating join requests."""
    
    class Meta:
        model = JoinRequest
        fields = ['message']
    
    def validate(self, attrs):
        group = self.context['group']
        user = self.context['request'].user
        
        # Check if already a member
        if group.members.filter(user=user).exists():
            raise serializers.ValidationError('You are already a member of this group')
        
        # Check if group is full
        if group.is_full:
            raise serializers.ValidationError('This group is full')
        
        # Check if pending request exists
        if group.join_requests.filter(user=user, status='pending').exists():
            raise serializers.ValidationError('You already have a pending request for this group')
        
        return attrs
    
    def create(self, validated_data):
        group = self.context['group']
        user = self.context['request'].user
        return JoinRequest.objects.create(group=group, user=user, **validated_data)


class JoinRequestReviewSerializer(serializers.Serializer):
    """Serializer for reviewing join requests."""
    action = serializers.ChoiceField(choices=['accept', 'reject'])
    response_message = serializers.CharField(required=False, allow_blank=True)
