# plant_detection/urls.py
from django.urls import path
from .views import PlantDetectionView, DetectionHistoryView

urlpatterns = [
    path('detect/', PlantDetectionView.as_view(), name='detect'),
    path('history/', DetectionHistoryView.as_view(), name='detection-history'),
]