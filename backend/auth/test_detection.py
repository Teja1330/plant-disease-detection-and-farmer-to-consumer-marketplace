import os
import django
import requests
from io import BytesIO

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auth.settings')
django.setup()

# Test the detector directly
from plant_detection.services import PlantDiseaseDetector

print("Testing Plant Disease Detector...")
detector = PlantDiseaseDetector()

# Test with a sample image (you'll need to provide one)
# For now, let's just verify the detector works
if detector._model:
    print("✅ Model is ready for predictions!")
    print(f"Model input shape: {detector._model.input_shape}")
    print(f"Model output shape: {detector._model.output_shape}")
else:
    print("❌ Model not loaded")
