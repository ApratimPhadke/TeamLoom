"""
Serializers for user authentication and account management.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
import re

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user display."""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'avatar_url', 'email_verified', 'created_at'
        ]
        read_only_fields = ['id', 'email', 'email_verified', 'created_at']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'role'
        ]
    
    def validate_email(self, value):
        """Validate email format and check for .edu domain for students."""
        email = value.lower()
        role = self.initial_data.get('role', 'student')
        
        # For students and professors, optionally require .edu domain
        # Commented out for development - enable in production
        # if role in ['student', 'professor']:
        #     if not email.endswith('.edu') and not email.endswith('.edu.in'):
        #         raise serializers.ValidationError(
        #             'Students and professors must use an institutional email (.edu)'
        #         )
        
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        
        return email
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom JWT token serializer with additional user data."""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['role'] = user.role
        token['full_name'] = user.get_full_name()
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add user info to response
        data['user'] = UserSerializer(self.user).data
        return data


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value


class EmailVerificationSerializer(serializers.Serializer):
    """Serializer for email verification."""
    token = serializers.CharField(required=True)
