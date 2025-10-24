# plant_detection/models.py
from django.db import models

class PlantDetectionResult(models.Model):
    user_id = models.PositiveIntegerField()  # Required field
    user_email = models.EmailField()  # Required field
    user_type = models.CharField(max_length=20)  # Required field
    
    image = models.ImageField(upload_to='plant_images/')
    prediction = models.CharField(max_length=255)
    confidence = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user_email} - {self.prediction} - {self.created_at}"