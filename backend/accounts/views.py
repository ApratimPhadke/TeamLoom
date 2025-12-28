"""
Authentication views for user registration, login, and account management.
"""
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
import secrets

from .serializers import (
    UserSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    PasswordChangeSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    Register a new user account.
    
    POST /api/auth/register/
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Registration successful',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Login and obtain JWT tokens.
    
    POST /api/auth/login/
    """
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # Update last_active timestamp
        if response.status_code == 200:
            email = request.data.get('email')
            User.objects.filter(email=email).update(last_active=timezone.now())
        
        return response


class LogoutView(APIView):
    """
    Logout by blacklisting the refresh token.
    
    POST /api/auth/logout/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(APIView):
    """
    Get current authenticated user's details.
    
    GET /api/auth/me/
    PUT /api/auth/me/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class PasswordChangeView(APIView):
    """
    Change user password.
    
    POST /api/auth/change-password/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_email(request):
    """
    Verify email with token.
    
    POST /api/auth/verify-email/
    """
    token = request.data.get('token')
    if not token:
        return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(verification_token=token)
        user.email_verified = True
        user.verification_token = None
        user.save()
        return Response({'message': 'Email verified successfully'})
    except User.DoesNotExist:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def resend_verification(request):
    """
    Resend email verification token.
    
    POST /api/auth/resend-verification/
    """
    user = request.user
    if user.email_verified:
        return Response({'message': 'Email already verified'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate new token
    user.verification_token = secrets.token_urlsafe(32)
    user.save()
    
    # TODO: Send email via Celery task
    # from .tasks import send_verification_email
    # send_verification_email.delay(user.id)
    
    return Response({'message': 'Verification email sent'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_avatar(request):
    """
    Upload user avatar image.
    
    POST /api/auth/upload-avatar/
    """
    import os
    import uuid
    from django.conf import settings
    
    if 'avatar' not in request.FILES:
        return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    avatar_file = request.FILES['avatar']
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if avatar_file.content_type not in allowed_types:
        return Response({'error': 'Invalid file type. Use JPG, PNG, GIF, or WebP.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate file size (max 5MB)
    if avatar_file.size > 5 * 1024 * 1024:
        return Response({'error': 'File too large. Max 5MB.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate unique filename
    ext = avatar_file.name.split('.')[-1]
    filename = f"avatars/{request.user.id}_{uuid.uuid4().hex[:8]}.{ext}"
    
    # Ensure avatars directory exists
    avatars_dir = os.path.join(settings.MEDIA_ROOT, 'avatars')
    os.makedirs(avatars_dir, exist_ok=True)
    
    # Save file
    filepath = os.path.join(settings.MEDIA_ROOT, filename)
    with open(filepath, 'wb+') as destination:
        for chunk in avatar_file.chunks():
            destination.write(chunk)
    
    # Update user avatar_url
    avatar_url = f"{settings.MEDIA_URL}{filename}"
    request.user.avatar_url = avatar_url
    request.user.save()
    
    return Response({
        'message': 'Avatar uploaded successfully',
        'avatar_url': avatar_url
    })

