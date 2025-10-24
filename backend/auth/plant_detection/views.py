# plant_detection/views.py - Add delete functionality
import os
import tempfile
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404

from .services import PlantDiseaseDetector
from .models import PlantDetectionResult
from .serializers import PlantDetectionResultSerializer, PlantDetectionRequestSerializer
from users.permissions import IsFarmerOrMultiAccount, IsAuthenticatedWithJWT

@method_decorator(csrf_exempt, name='dispatch')
class PlantDetectionView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]

    def post(self, request):
        try:
            # Debug: Check user information
            print(f"🔍 User ID: {request.user.id}")
            print(f"🔍 User Email: {request.user.email}")
            print(f"🔍 User Role: {getattr(request.user, 'role', 'No role')}")
            print(f"🔍 Has farmer: {getattr(request.user, 'has_farmer', False)}")
            
            # Validate the request
            serializer = PlantDetectionRequestSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({'detail': 'Invalid data', 'errors': serializer.errors}, status=400)

            image_file = request.FILES['image']
            
            # Validate file type
            if not image_file.content_type.startswith('image/'):
                return Response({'detail': 'File must be an image'}, status=400)
            
            # Validate file size (max 10MB)
            if image_file.size > 10 * 1024 * 1024:
                return Response({'detail': 'File size too large. Maximum 10MB allowed.'}, status=400)

            temp_path = None
            try:
                # Create a temporary file
                with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                    for chunk in image_file.chunks():
                        temp_file.write(chunk)
                    temp_path = temp_file.name

                # Initialize detector and make prediction
                detector = PlantDiseaseDetector()
                result = detector.predict(temp_path)

                if 'error' in result:
                    return Response({'detail': result['error']}, status=400)

                # Save the result to database with user information
                detection_result = PlantDetectionResult.objects.create(
                    user_id=request.user.id,
                    user_email=request.user.email,
                    user_type=getattr(request.user, 'role', 'unknown'),
                    image=image_file,
                    prediction=result['prediction'],
                    confidence=result['confidence']
                )

                # Serialize the response
                response_data = PlantDetectionResultSerializer(detection_result).data
                response_data.update({
                    'prediction': result['prediction'],
                    'confidence': result['confidence'],
                    'class_index': result.get('class_index', 0),
                    'top_predictions': result.get('top_predictions', [])[:3]  # Only top 3
                })

                return Response(response_data)

            finally:
                # Clean up temporary file
                if temp_path and os.path.exists(temp_path):
                    os.unlink(temp_path)

        except Exception as e:
            print(f"❌ Detection error: {str(e)}")
            return Response({'detail': f'Detection failed: {str(e)}'}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class DetectionHistoryView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]

    def get(self, request):
        try:
            # Filter by user_id
            history = PlantDetectionResult.objects.filter(user_id=request.user.id).order_by('-created_at')
            serializer = PlantDetectionResultSerializer(history, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"❌ History error: {str(e)}")
            return Response({'detail': f'Failed to fetch history: {str(e)}'}, status=400)
    
    def delete(self, request, detection_id=None):
        try:
            if detection_id:
                # Delete specific detection
                detection = get_object_or_404(PlantDetectionResult, id=detection_id, user_id=request.user.id)
                detection.delete()
                return Response({'detail': 'Detection deleted successfully'})
            else:
                # Delete all user's history
                PlantDetectionResult.objects.filter(user_id=request.user.id).delete()
                return Response({'detail': 'All history deleted successfully'})
        except Exception as e:
            print(f"❌ Delete error: {str(e)}")
            return Response({'detail': f'Failed to delete: {str(e)}'}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class TestAuthView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]
    
    def get(self, request):
        return Response({
            'message': 'Authentication successful',
            'user_id': request.user.id,
            'username': getattr(request.user, 'name', 'No name'),
            'email': request.user.email,
            'role': getattr(request.user, 'role', 'No role'),
            'has_farmer': getattr(request.user, 'has_farmer', False),
            'has_customer': getattr(request.user, 'has_customer', False)
        })