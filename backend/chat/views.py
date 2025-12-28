"""
HTTP API views for chat message history.
"""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Message, MessageRead
from .serializers import MessageSerializer, MessageListSerializer
from groups.models import Group, GroupMember


class IsGroupMember(permissions.BasePermission):
    """Check if user is a member of the group."""
    
    def has_permission(self, request, view):
        group_id = view.kwargs.get('group_id')
        return GroupMember.objects.filter(
            group_id=group_id,
            user=request.user
        ).exists()


class MessageListView(generics.ListAPIView):
    """
    Get message history for a group.
    
    GET /api/chat/{group_id}/messages/
    """
    serializer_class = MessageListSerializer
    permission_classes = [permissions.IsAuthenticated, IsGroupMember]
    
    def get_queryset(self):
        group_id = self.kwargs['group_id']
        return Message.objects.filter(
            group_id=group_id,
            is_deleted=False
        ).select_related('sender').order_by('-created_at')[:100]
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        # Reverse to get chronological order
        messages = list(reversed(queryset))
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)


class MessageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Get, update, or delete a specific message.
    
    GET/PUT/DELETE /api/chat/{group_id}/messages/{message_id}/
    """
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsGroupMember]
    
    def get_queryset(self):
        group_id = self.kwargs['group_id']
        return Message.objects.filter(group_id=group_id)
    
    def get_object(self):
        queryset = self.get_queryset()
        message = get_object_or_404(queryset, id=self.kwargs['message_id'])
        return message
    
    def update(self, request, *args, **kwargs):
        message = self.get_object()
        
        # Only sender can edit
        if message.sender != request.user:
            return Response(
                {'error': 'You can only edit your own messages'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        message.content = request.data.get('content', message.content)
        message.is_edited = True
        message.edited_at = timezone.now()
        message.save()
        
        return Response(MessageSerializer(message).data)
    
    def destroy(self, request, *args, **kwargs):
        message = self.get_object()
        
        # Only sender can delete (soft delete)
        if message.sender != request.user:
            return Response(
                {'error': 'You can only delete your own messages'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        message.is_deleted = True
        message.content = '[Message deleted]'
        message.save()
        
        return Response(status=status.HTTP_204_NO_CONTENT)


class UnreadCountView(APIView):
    """
    Get unread message count for a specific group.
    
    GET /api/chat/groups/{group_id}/unread/
    """
    permission_classes = [permissions.IsAuthenticated, IsGroupMember]
    
    def get(self, request, group_id):
        # Check membership
        try:
            membership = GroupMember.objects.get(group_id=group_id, user=request.user)
        except GroupMember.DoesNotExist:
            return Response({'unread_count': 0})
        
        # Count messages after joining that user hasn't read
        total_messages = Message.objects.filter(
            group_id=group_id,
            created_at__gte=membership.joined_at,
            is_deleted=False
        ).exclude(sender=request.user).count()
        
        read_messages = MessageRead.objects.filter(
            message__group_id=group_id,
            user=request.user
        ).count()
        
        unread_count = max(0, total_messages - read_messages)
        return Response({'unread_count': unread_count})


class FileUploadView(APIView):
    """
    Upload a file for chat.
    
    POST /api/chat/upload/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        import os
        import uuid
        from django.conf import settings
        
        if 'file' not in request.FILES:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        group_id = request.data.get('group_id')
        if not group_id:
            return Response({'error': 'group_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check membership
        if not GroupMember.objects.filter(group_id=group_id, user=request.user).exists():
            return Response({'error': 'Not a member of this group'}, status=status.HTTP_403_FORBIDDEN)
        
        uploaded_file = request.FILES['file']
        
        # Validate file size (max 10MB)
        if uploaded_file.size > 10 * 1024 * 1024:
            return Response({'error': 'File too large. Max 10MB.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Determine file type
        content_type = uploaded_file.content_type
        if content_type.startswith('image/'):
            file_type = 'image'
        else:
            file_type = 'file'
        
        # Generate unique filename
        ext = uploaded_file.name.split('.')[-1] if '.' in uploaded_file.name else 'bin'
        filename = f"chat/{group_id}/{uuid.uuid4().hex[:12]}.{ext}"
        
        # Ensure directory exists
        file_dir = os.path.join(settings.MEDIA_ROOT, 'chat', str(group_id))
        os.makedirs(file_dir, exist_ok=True)
        
        # Save file
        filepath = os.path.join(settings.MEDIA_ROOT, filename)
        with open(filepath, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        
        file_url = f"{settings.MEDIA_URL}{filename}"
        
        return Response({
            'file_url': file_url,
            'file_type': file_type,
            'file_name': uploaded_file.name
        })


