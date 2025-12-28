"""
API views for notifications.
"""
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """
    Get user's notifications.
    
    GET /api/notifications/
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(
            recipient=self.request.user
        ).select_related('actor', 'group').order_by('-created_at')[:50]


class UnreadNotificationCountView(APIView):
    """
    Get count of unread notifications.
    
    GET /api/notifications/unread-count/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        count = Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).count()
        return Response({'unread_count': count})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_as_read(request, notification_id):
    """
    Mark a notification as read.
    
    POST /api/notifications/{id}/read/
    """
    try:
        notification = Notification.objects.get(
            id=notification_id,
            recipient=request.user
        )
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        return Response({'message': 'Marked as read'})
    except Notification.DoesNotExist:
        return Response(
            {'error': 'Notification not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_as_read(request):
    """
    Mark all notifications as read.
    
    POST /api/notifications/mark-all-read/
    """
    Notification.objects.filter(
        recipient=request.user,
        is_read=False
    ).update(is_read=True, read_at=timezone.now())
    
    return Response({'message': 'All notifications marked as read'})
