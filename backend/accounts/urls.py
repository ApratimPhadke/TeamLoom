"""
URL patterns for authentication endpoints.
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from . import google_auth

app_name = 'accounts'

urlpatterns = [
    # Registration & Login
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Current user
    path('me/', views.CurrentUserView.as_view(), name='current_user'),
    
    # Password management
    path('change-password/', views.PasswordChangeView.as_view(), name='change_password'),
    
    # Email verification
    path('verify-email/', views.verify_email, name='verify_email'),
    path('resend-verification/', views.resend_verification, name='resend_verification'),
    
    # Avatar upload
    path('upload-avatar/', views.upload_avatar, name='upload_avatar'),
    
    # Google OAuth
    path('google/', google_auth.google_auth, name='google_auth'),
]
