"""
WebSocket consumers for real-time chat.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for group chat.
    
    Connect: ws://host/ws/chat/{group_id}/
    """
    
    async def connect(self):
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.room_group_name = f'chat_{self.group_id}'
        self.user = self.scope['user']
        
        # Check if user is authenticated
        if not self.user.is_authenticated:
            await self.close()
            return
        
        # Check if user is a member of the group
        is_member = await self.check_membership()
        if not is_member:
            await self.close()
            return
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Notify others that user joined
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_joined',
                'user_id': self.user.id,
                'user_name': self.user.get_full_name(),
            }
        )
    
    async def disconnect(self, close_code):
        # Only notify if user was authenticated
        if hasattr(self, 'room_group_name') and hasattr(self, 'user') and self.user.is_authenticated:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_left',
                    'user_id': self.user.id,
                    'user_name': self.user.get_full_name(),
                }
            )
            
            # Leave room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Handle incoming WebSocket message."""
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'message')
            
            if message_type == 'message':
                await self.handle_message(data)
            elif message_type == 'typing':
                await self.handle_typing(data)
            elif message_type == 'read':
                await self.handle_read(data)
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))
    
    async def handle_message(self, data):
        """Handle new chat message."""
        content = data.get('content', '').strip()
        message_type = data.get('message_type', 'text')
        file_url = data.get('file_url')
        file_name = data.get('file_name')
        
        # For file messages, content is optional (use filename as content if not provided)
        if message_type in ['image', 'file'] and not content:
            content = f"Sent a file: {file_name}" if file_name else "Sent a file"
        
        if not content:
            return
        
        reply_to_id = data.get('reply_to')
        
        # Save message to database
        message = await self.save_message(content, reply_to_id, message_type, file_url)
        
        # Broadcast to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': message.id,
                    'sender': {
                        'id': self.user.id,
                        'name': self.user.get_full_name(),
                        'avatar': self.user.avatar_url,
                    },
                    'content': content,
                    'message_type': message_type,
                    'file_url': file_url,
                    'file_name': file_name,
                    'reply_to': reply_to_id,
                    'created_at': message.created_at.isoformat(),
                }
            }
        )
    
    async def handle_typing(self, data):
        """Handle typing indicator."""
        is_typing = data.get('is_typing', False)
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_typing',
                'user_id': self.user.id,
                'user_name': self.user.get_full_name(),
                'is_typing': is_typing,
            }
        )
    
    async def handle_read(self, data):
        """Handle read receipt."""
        message_id = data.get('message_id')
        if message_id:
            await self.mark_as_read(message_id)
    
    # --- Channel layer event handlers ---
    
    async def chat_message(self, event):
        """Send chat message to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message']
        }))
    
    async def user_typing(self, event):
        """Send typing indicator to WebSocket."""
        # Don't send to the user who is typing
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'typing',
                'user_id': event['user_id'],
                'user_name': event['user_name'],
                'is_typing': event['is_typing'],
            }))
    
    async def user_joined(self, event):
        """Send user joined notification."""
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'user_joined',
                'user_id': event['user_id'],
                'user_name': event['user_name'],
            }))
    
    async def user_left(self, event):
        """Send user left notification."""
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'user_left',
                'user_id': event['user_id'],
                'user_name': event['user_name'],
            }))
    
    # --- Database operations ---
    
    @database_sync_to_async
    def check_membership(self):
        """Check if user is a member of the group."""
        from groups.models import GroupMember
        return GroupMember.objects.filter(
            group_id=self.group_id,
            user=self.user
        ).exists()
    
    @database_sync_to_async
    def save_message(self, content, reply_to_id=None, message_type='text', file_url=None):
        """Save message to database."""
        from .models import Message
        
        message = Message.objects.create(
            group_id=self.group_id,
            sender=self.user,
            content=content,
            reply_to_id=reply_to_id,
            message_type=message_type,
            file_url=file_url
        )
        return message
    
    @database_sync_to_async
    def mark_as_read(self, message_id):
        """Mark a message as read."""
        from .models import Message, MessageRead
        
        try:
            message = Message.objects.get(id=message_id, group_id=self.group_id)
            MessageRead.objects.get_or_create(
                message=message,
                user=self.user
            )
        except Message.DoesNotExist:
            pass
