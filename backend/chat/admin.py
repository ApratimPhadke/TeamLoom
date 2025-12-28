from django.contrib import admin
from .models import Message, MessageRead


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender', 'group', 'content_preview', 'message_type', 'is_deleted', 'created_at']
    list_filter = ['message_type', 'is_deleted', 'is_edited', 'created_at']
    search_fields = ['content', 'sender__email', 'group__name']
    raw_id_fields = ['sender', 'group', 'reply_to']
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content'
