# plant_detection/serializers.py
from rest_framework import serializers
from .models import PlantDetectionResult

class PlantDetectionResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantDetectionResult
        fields = ['id', 'image', 'prediction', 'confidence', 'created_at', 'user_id', 'user_email', 'user_type']
        read_only_fields = ['id', 'created_at', 'user_id', 'user_email', 'user_type']

class PlantDetectionRequestSerializer(serializers.Serializer):
    image = serializers.ImageField(
        max_length=100,
        allow_empty_file=False,
        use_url=True
    )
    
    def validate_image(self, value):
        # Validate file size (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        if value.size > max_size:
            raise serializers.ValidationError("Image size too large. Maximum 10MB allowed.")
        
        # Validate file type
        valid_extensions = ['jpg', 'jpeg', 'png', 'bmp']
        extension = value.name.split('.')[-1].lower()
        if extension not in valid_extensions:
            raise serializers.ValidationError(f"Unsupported file format. Supported formats: {', '.join(valid_extensions)}")
        
        return value