"""
URL patterns for notification endpoints.
"""
from django.urls import path
from . import views

app_name = 'notifications'

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='list'),
    path('unread-count/', views.UnreadNotificationCountView.as_view(), name='unread_count'),
    path('<int:notification_id>/read/', views.mark_as_read, name='mark_read'),
    path('mark-all-read/', views.mark_all_as_read, name='mark_all_read'),
]
