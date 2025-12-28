"""
URL patterns for group endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'groups'

router = DefaultRouter()
router.register('', views.GroupViewSet, basename='groups')

urlpatterns = [
    path('', include(router.urls)),
]
