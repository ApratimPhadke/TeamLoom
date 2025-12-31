"""
Google OAuth authentication view.
Verifies Google ID tokens and creates/authenticates users.
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

User = get_user_model()


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def google_auth(request):
    """
    Authenticate user with Google OAuth.
    
    Expects: { "credential": "<Google ID token>" }
    Returns: User data + JWT tokens
    """
    credential = request.data.get('credential')
    
    if not credential:
        return Response(
            {'error': 'Google credential is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Verify the Google ID token
        google_client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None)
        
        if not google_client_id:
            return Response(
                {'error': 'Google OAuth is not configured on the server'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        idinfo = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            google_client_id
        )
        
        # Extract user info from token
        email = idinfo.get('email')
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')
        picture = idinfo.get('picture', '')
        google_id = idinfo.get('sub')
        
        if not email:
            return Response(
                {'error': 'Email not provided by Google'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user exists
        user = User.objects.filter(email=email).first()
        
        if user:
            # User exists - update Google ID if not set
            if not user.google_id:
                user.google_id = google_id
                user.save(update_fields=['google_id'])
            
            # Update avatar if user doesn't have one
            if picture and not user.avatar_url:
                user.avatar_url = picture
                user.save(update_fields=['avatar_url'])
        else:
            # Create new user
            user = User.objects.create(
                email=email,
                first_name=first_name,
                last_name=last_name,
                google_id=google_id,
                avatar_url=picture,
                email_verified=True,  # Google emails are verified
            )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Google authentication successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'avatar_url': user.avatar_url,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
        
    except ValueError as e:
        # Invalid token
        return Response(
            {'error': f'Invalid Google token: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': f'Authentication failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
