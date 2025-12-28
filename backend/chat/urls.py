"""
URL patterns for chat HTTP endpoints.
"""
from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    path('groups/<int:group_id>/messages/', views.MessageListView.as_view(), name='message_list'),
    path('groups/<int:group_id>/messages/<int:message_id>/', views.MessageDetailView.as_view(), name='message_detail'),
    path('groups/<int:group_id>/unread/', views.UnreadCountView.as_view(), name='unread_count'),
    path('upload/', views.FileUploadView.as_view(), name='file_upload'),
]

