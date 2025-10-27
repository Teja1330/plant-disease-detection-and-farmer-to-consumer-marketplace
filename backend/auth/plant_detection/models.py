# plant_detection/models.py
from django.db import models
import base64

class PlantDetectionResult(models.Model):
    user_id = models.IntegerField()
    user_email = models.EmailField()
    user_type = models.CharField(max_length=20)
    
    image_data = models.BinaryField(null=True, blank=True)
    image_name = models.CharField(max_length=255, null=True, blank=True)
    image_content_type = models.CharField(max_length=100, null=True, blank=True)
    
    prediction = models.CharField(max_length=255)
    confidence = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Detection {self.id} - {self.prediction}"

    @property
    def image_url(self):
        # Generate a data URL for the frontend if image_data exists
        if self.image_data:
            try:
                encoded_image = base64.b64encode(self.image_data).decode('utf-8')
                return f"data:{self.image_content_type};base64,{encoded_image}"
            except Exception as e:
                print(f"Error encoding image for detection {self.id}: {e}")
                return None
        return None

    def has_image_data(self):
        """Check if this record has binary image data"""
        return bool(self.image_data)