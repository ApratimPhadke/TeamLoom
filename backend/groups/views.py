"""
API views for groups and join requests.
"""
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from django.shortcuts import get_object_or_404

from .models import Group, GroupMember, JoinRequest
from .serializers import (
    GroupSerializer,
    GroupListSerializer,
    GroupCreateSerializer,
    GroupMemberSerializer,
    JoinRequestSerializer,
    JoinRequestCreateSerializer,
    JoinRequestReviewSerializer,
)


class IsGroupLeader(permissions.BasePermission):
    """Permission check for group leaders."""
    
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Group):
            return obj.leader == request.user
        elif isinstance(obj, JoinRequest):
            return obj.group.leader == request.user
        return False


class GroupViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for groups.
    
    GET /api/groups/ - List all public groups
    POST /api/groups/ - Create a new group
    GET /api/groups/{id}/ - Get group details
    PUT /api/groups/{id}/ - Update group (leader only)
    DELETE /api/groups/{id}/ - Delete group (leader only)
    """
    queryset = Group.objects.select_related('leader').prefetch_related('members', 'members__user')
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['type', 'status', 'is_featured']
    search_fields = ['name', 'description', 'tags']
    ordering_fields = ['created_at', 'view_count', 'capacity']
    ordering = ['-is_featured', '-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return GroupListSerializer
        elif self.action == 'create':
            return GroupCreateSerializer
        return GroupSerializer
    
    def get_queryset(self):
        qs = super().get_queryset()
        
        # Filter by open spots
        if self.request.query_params.get('has_spots') == 'true':
            qs = qs.annotate(
                members_count=Count('members')
            ).filter(members_count__lt=models.F('capacity'))
        
        # Filter by skills
        skills = self.request.query_params.get('skills')
        if skills:
            skill_ids = [int(x) for x in skills.split(',') if x.isdigit()]
            # This is a simplified filter - for production, use a more sophisticated query
            for skill_id in skill_ids:
                qs = qs.filter(required_skills__contains=[{'skill_id': skill_id}])
        
        # Only show public groups or groups user is a member of
        if self.action == 'list':
            qs = qs.filter(
                Q(is_public=True) | Q(members__user=self.request.user)
            ).distinct()
        
        return qs
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment view count
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsGroupLeader()]
        return super().get_permissions()
    
    def create(self, request, *args, **kwargs):
        """Create group and return full serializer with ID."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group = serializer.save()
        # Return full serializer with ID
        return Response(
            GroupSerializer(group, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )
        return Response(
            GroupSerializer(group, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        Toggle group completion status (leader only).
        
        POST /api/groups/{id}/complete/
        """
        group = self.get_object()
        
        if group.leader != request.user:
            return Response(
                {'error': 'Only the group leader can mark group as completed'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        group.status = 'completed' if group.status != 'completed' else 'active'
        group.save()
        
        return Response({
            'status': group.status,
            'message': f"Group marked as {group.status}"
        })
    
    # --- Join Request Actions ---
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """
        Send a join request to a group.
        
        POST /api/groups/{id}/join/
        """
        group = self.get_object()
        serializer = JoinRequestCreateSerializer(
            data=request.data,
            context={'request': request, 'group': group}
        )
        serializer.is_valid(raise_exception=True)
        join_request = serializer.save()
        
        # Send notification to group leader
        from notifications.models import Notification
        Notification.objects.create(
            recipient=group.leader,
            notification_type='join_request',
            title='New Join Request',
            message=f'{request.user.get_full_name()} wants to join your group "{group.name}"',
            actor=request.user,
            group=group,
            link=f'/groups/{group.id}'
        )
        
        return Response(
            JoinRequestSerializer(join_request).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['get'])
    def requests(self, request, pk=None):
        """
        Get pending join requests for a group (leader only).
        
        GET /api/groups/{id}/requests/
        """
        group = self.get_object()
        
        # Only leader can view requests
        if group.leader != request.user:
            return Response(
                {'error': 'Only the group leader can view join requests'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        requests = group.join_requests.filter(status='pending').select_related('user')
        serializer = JoinRequestSerializer(requests, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='requests/(?P<request_id>[^/.]+)/review')
    def review_request(self, request, pk=None, request_id=None):
        """
        Accept or reject a join request (leader only).
        
        POST /api/groups/{id}/requests/{request_id}/review/
        """
        group = self.get_object()
        
        # Only leader can review requests
        if group.leader != request.user:
            return Response(
                {'error': 'Only the group leader can review join requests'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        join_request = get_object_or_404(
            JoinRequest,
            id=request_id,
            group=group,
            status='pending'
        )
        
        serializer = JoinRequestReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        action_type = serializer.validated_data['action']
        response_msg = serializer.validated_data.get('response_message', '')
        
        if action_type == 'accept':
            # Check if group is full
            if group.is_full:
                return Response(
                    {'error': 'Group is full'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Accept request and add member
            join_request.status = 'accepted'
            join_request.response_message = response_msg
            join_request.reviewed_by = request.user
            join_request.reviewed_at = timezone.now()
            join_request.save()
            
            # Add as member
            GroupMember.objects.create(
                group=group,
                user=join_request.user,
                role='member'
            )
            
            # TODO: Send notification to requester
            
        else:  # reject
            join_request.status = 'rejected'
            join_request.response_message = response_msg
            join_request.reviewed_by = request.user
            join_request.reviewed_at = timezone.now()
            join_request.save()
            
            # TODO: Send notification to requester
        
        return Response(JoinRequestSerializer(join_request).data)
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """
        Request to leave a group (requires leader approval).
        Leaders cannot leave their own group.
        
        POST /api/groups/{id}/leave/
        """
        from .models import LeaveRequest
        
        group = self.get_object()
        
        # Cannot leave if leader
        if group.leader == request.user:
            return Response(
                {'error': 'Leaders cannot leave their group. Transfer leadership or delete the group.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        membership = group.members.filter(user=request.user).first()
        if not membership:
            return Response(
                {'error': 'You are not a member of this group'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check for existing pending leave request
        existing = LeaveRequest.objects.filter(
            group=group, user=request.user, status='pending'
        ).first()
        if existing:
            return Response(
                {'error': 'You already have a pending leave request'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create leave request
        reason = request.data.get('reason', '')
        leave_request = LeaveRequest.objects.create(
            group=group,
            user=request.user,
            reason=reason
        )
        
        return Response({
            'message': 'Leave request submitted. Waiting for leader approval.',
            'request_id': leave_request.id
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def leave_requests(self, request, pk=None):
        """
        Get pending leave requests for a group (leader only).
        
        GET /api/groups/{id}/leave_requests/
        """
        from .models import LeaveRequest
        
        group = self.get_object()
        
        if group.leader != request.user:
            return Response(
                {'error': 'Only the group leader can view leave requests'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        requests = LeaveRequest.objects.filter(group=group, status='pending').select_related('user')
        data = [{
            'id': r.id,
            'user': {
                'id': r.user.id,
                'full_name': r.user.get_full_name(),
                'email': r.user.email
            },
            'reason': r.reason,
            'created_at': r.created_at
        } for r in requests]
        
        return Response(data)
    
    @action(detail=True, methods=['post'], url_path='leave_requests/(?P<request_id>[^/.]+)/review')
    def review_leave_request(self, request, pk=None, request_id=None):
        """
        Approve or reject a leave request (leader only).
        
        POST /api/groups/{id}/leave_requests/{request_id}/review/
        """
        from .models import LeaveRequest
        
        group = self.get_object()
        
        if group.leader != request.user:
            return Response(
                {'error': 'Only the group leader can review leave requests'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        leave_request = get_object_or_404(LeaveRequest, id=request_id, group=group, status='pending')
        action_type = request.data.get('action')  # 'approve' or 'reject'
        
        if action_type == 'approve':
            leave_request.status = 'approved'
            leave_request.reviewed_by = request.user
            leave_request.reviewed_at = timezone.now()
            leave_request.save()
            
            # Remove the member
            group.members.filter(user=leave_request.user).delete()
            
            return Response({'message': 'Leave request approved. Member removed from group.'})
        
        elif action_type == 'reject':
            leave_request.status = 'rejected'
            leave_request.reviewed_by = request.user
            leave_request.reviewed_at = timezone.now()
            leave_request.save()
            
            return Response({'message': 'Leave request rejected.'})
        
        return Response({'error': 'Invalid action. Use "approve" or "reject".'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], url_path='members/(?P<user_id>[^/.]+)/remove')
    def remove_member(self, request, pk=None, user_id=None):
        """
        Remove a member from the group (leader only).
        
        POST /api/groups/{id}/members/{user_id}/remove/
        """
        group = self.get_object()
        
        if group.leader != request.user:
            return Response(
                {'error': 'Only the group leader can remove members'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if int(user_id) == request.user.id:
            return Response(
                {'error': 'You cannot remove yourself'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        membership = group.members.filter(user_id=user_id).first()
        if not membership:
            return Response(
                {'error': 'User is not a member of this group'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        membership.delete()
        
        # TODO: Send notification to removed user
        
        return Response({'message': 'Member removed successfully'})
    
    # --- My Groups ---
    
    @action(detail=False, methods=['get'])
    def my_groups(self, request):
        """
        Get groups the current user is a member of.
        
        GET /api/groups/my_groups/
        """
        groups = Group.objects.filter(
            members__user=request.user
        ).select_related('leader').prefetch_related('members')
        
        serializer = GroupListSerializer(groups, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_requests(self, request):
        """
        Get the current user's join requests.
        
        GET /api/groups/my_requests/
        """
        requests = JoinRequest.objects.filter(
            user=request.user
        ).select_related('group', 'group__leader').order_by('-created_at')
        
        serializer = JoinRequestSerializer(requests, many=True)
        return Response(serializer.data)
    
    # --- Discovery ---
    
    @action(detail=False, methods=['get'])
    def recommended(self, request):
        """
        Get recommended groups based on user's skills.
        
        GET /api/groups/recommended/
        """
        user = request.user
        
        try:
            profile = user.student_profile
            user_skills = [s.get('skill_id') for s in profile.skills]
        except:
            user_skills = []
        
        if not user_skills:
            # No skills, return featured/popular groups
            groups = self.get_queryset().filter(
                status='forming',
                is_public=True
            ).exclude(
                members__user=user
            ).order_by('-is_featured', '-view_count')[:10]
        else:
            # Find groups that need skills the user has
            groups = self.get_queryset().filter(
                status='forming',
                is_public=True
            ).exclude(
                members__user=user
            )
            
            # Score and sort by skill match
            scored_groups = []
            for group in groups:
                required_skill_ids = [r.get('skill_id') for r in group.required_skills]
                match_count = len(set(user_skills) & set(required_skill_ids))
                if match_count > 0:
                    scored_groups.append((match_count, group))
            
            scored_groups.sort(key=lambda x: -x[0])
            groups = [g for _, g in scored_groups[:10]]
        
        serializer = GroupListSerializer(groups, many=True)
        return Response(serializer.data)
