"""
URL configuration for TeamLoom project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def health_check(request):
    """Health check endpoint for Render deployment"""
    return JsonResponse({'status': 'healthy', 'service': 'teamloom-backend'})

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Health check for deployment
    path('api/health/', health_check, name='health_check'),
    
    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/profiles/', include('profiles.urls')),
    path('api/groups/', include('groups.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/notifications/', include('notifications.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
