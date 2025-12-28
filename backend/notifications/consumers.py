"""
WebSocket consumer for real-time notifications.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time notifications.
    
    Connect: ws://host/ws/notifications/
    """
    
    async def connect(self):
        self.user = self.scope['user']
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        # Create a unique channel for this user
        self.room_group_name = f'notifications_{self.user.id}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send unread count on connect
        unread_count = await self.get_unread_count()
        await self.send(text_data=json.dumps({
            'type': 'unread_count',
            'count': unread_count
        }))
    
    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Handle incoming messages (mark as read, etc.)"""
        try:
            data = json.loads(text_data)
            if data.get('type') == 'mark_read':
                notification_id = data.get('notification_id')
                await self.mark_as_read(notification_id)
        except json.JSONDecodeError:
            pass
    
    # --- Channel layer event handlers ---
    
    async def notification(self, event):
        """Send new notification to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': event['notification']
        }))
    
    async def unread_count_update(self, event):
        """Send updated unread count."""
        await self.send(text_data=json.dumps({
            'type': 'unread_count',
            'count': event['count']
        }))
    
    # --- Database operations ---
    
    @database_sync_to_async
    def get_unread_count(self):
        from .models import Notification
        return Notification.objects.filter(
            recipient=self.user,
            is_read=False
        ).count()
    
    @database_sync_to_async
    def mark_as_read(self, notification_id):
        from .models import Notification
        from django.utils import timezone
        
        Notification.objects.filter(
            id=notification_id,
            recipient=self.user
        ).update(is_read=True, read_at=timezone.now())
