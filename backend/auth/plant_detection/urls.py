# plant_detection/urls.py - UPDATED VERSION
from django.urls import path
from .views import (
    PlantDetectionView, 
    DetectionHistoryView, 
    DeleteDetectionView,
    TestAuthView
)

urlpatterns = [
    path('detect/', PlantDetectionView.as_view(), name='plant-detect'),
    path('history/', DetectionHistoryView.as_view(), name='detection-history'),
    path('history/<int:detection_id>/', DetectionHistoryView.as_view(), name='delete-single-detection'),
    path('history/clear/', DetectionHistoryView.as_view(), name='clear-all-detections'),
    path('test-auth/', TestAuthView.as_view(), name='test-auth'),
]