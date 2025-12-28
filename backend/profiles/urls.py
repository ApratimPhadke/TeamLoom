"""
URL patterns for profile endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'profiles'

router = DefaultRouter()
router.register('skills', views.SkillViewSet, basename='skills')
router.register('students', views.StudentProfileViewSet, basename='students')

urlpatterns = [
    path('me/', views.MyProfileView.as_view(), name='my_profile'),
    path('views/', views.ProfileViewsView.as_view(), name='profile_views'),
    path('', include(router.urls)),
]
