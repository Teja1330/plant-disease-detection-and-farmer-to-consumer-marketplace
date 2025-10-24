# plant_detection/urls.py
from django.urls import path
from .views import PlantDetectionView, DetectionHistoryView, TestAuthView

urlpatterns = [
    path('detect/', PlantDetectionView.as_view(), name='detect'),
    path('history/', DetectionHistoryView.as_view(), name='detection-history'),
    path('history/<int:detection_id>/', DetectionHistoryView.as_view(), name='delete-detection'),
    path('test-auth/', TestAuthView.as_view(), name='test-auth'),
]