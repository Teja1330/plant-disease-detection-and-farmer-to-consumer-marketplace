# plant_detection/views.py - COMPLETE UPDATED VERSION
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
            # Get user info with prefix IDs
            user_id = request.user.id  # This is now F1, C1, M1, etc.
            user_email = request.user.email
            user_role = getattr(request.user, 'role', 'unknown')
            
            print(f"🔍 Plant Detection - User ID: {user_id}, Email: {user_email}, Role: {user_role}")

            serializer = PlantDetectionRequestSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({'detail': 'Invalid data', 'errors': serializer.errors}, status=400)

            image_file = request.FILES['image']
            
            # Validate file type and size
            if not image_file.content_type.startswith('image/'):
                return Response({'detail': 'File must be an image'}, status=400)
            
            if image_file.size > 10 * 1024 * 1024:
                return Response({'detail': 'File size too large. Maximum 10MB allowed.'}, status=400)

            temp_path = None
            try:
                # Create temporary file for processing
                with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                    for chunk in image_file.chunks():
                        temp_file.write(chunk)
                    temp_path = temp_file.name

                # Read image data for database storage
                image_file.seek(0)  # Reset file pointer
                image_data = image_file.read()
                
                # Initialize detector and make prediction
                detector = PlantDiseaseDetector()
                result = detector.predict(temp_path)

                if 'error' in result:
                    return Response({'detail': result['error']}, status=400)

                # Save the result to database with prefix user_id
                detection_result = PlantDetectionResult.objects.create(
                    user_id=user_id,  # Now stores F1, C1, M1, etc.
                    user_email=user_email,
                    user_type=user_role,
                    image_data=image_data,
                    image_name=image_file.name,
                    image_content_type=image_file.content_type,
                    prediction=result['prediction'],
                    confidence=result['confidence']
                )

                print(f"✅ Plant detection saved for user {user_id}")

                # Serialize the response
                response_data = PlantDetectionResultSerializer(detection_result).data
                response_data.update({
                    'prediction': result['prediction'],
                    'confidence': result['confidence'],
                    'class_index': result.get('class_index', 0),
                    'top_predictions': result.get('top_predictions', [])[:3]
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
            user_id = request.user.id  # F1, C1, M1, etc.
            user_email = request.user.email
            
            print(f"🔍 Fetching detection history for user_id: {user_id}, email: {user_email}")
            
            # Filter by prefix user_id
            history = PlantDetectionResult.objects.filter(user_id=user_id).order_by('-created_at')
            
            print(f"📊 Found {history.count()} detection records for user {user_id}")
            
            for item in history:
                print(f"📄 Detection {item.id}: user_id={item.user_id}, prediction={item.prediction}")
            
            serializer = PlantDetectionResultSerializer(history, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            print(f"❌ History fetch error: {str(e)}")
            return Response({'detail': f'Failed to fetch history: {str(e)}'}, status=400)

    def delete(self, request, detection_id=None):
        try:
            user_id = request.user.id  # F1, C1, M1, etc.
            
            if detection_id:
                # Delete specific detection - filter by prefix user_id
                detection = get_object_or_404(PlantDetectionResult, id=detection_id, user_id=user_id)
                detection.delete()
                print(f"✅ Deleted detection {detection_id} for user {user_id}")
                return Response({'detail': 'Detection deleted successfully'})
            else:
                # Delete all user's history - filter by prefix user_id
                count, _ = PlantDetectionResult.objects.filter(user_id=user_id).delete()
                print(f"✅ Deleted all {count} detections for user {user_id}")
                return Response({'detail': f'All {count} detections deleted successfully'})
                
        except Exception as e:
            print(f"❌ Delete error: {str(e)}")
            return Response({'detail': f'Failed to delete: {str(e)}'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class DeleteDetectionView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]
    
    def delete(self, request, detection_id=None):
        try:
            user_id = request.user.id  # F1, C1, M1, etc.
            
            if detection_id:
                # Delete specific detection
                detection = get_object_or_404(PlantDetectionResult, id=detection_id, user_id=user_id)
                detection.delete()
                print(f"✅ Deleted detection {detection_id} for user {user_id}")
                return Response({'detail': 'Detection deleted successfully'})
            else:
                # Delete all detections for user
                count, _ = PlantDetectionResult.objects.filter(user_id=user_id).delete()
                print(f"✅ Deleted all {count} detections for user {user_id}")
                return Response({'detail': f'All {count} detections deleted successfully'})
                
        except Exception as e:
            print(f"❌ Error deleting detection: {str(e)}")
            return Response({'detail': f'Failed to delete detection: {str(e)}'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class TestAuthView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]
    
    def get(self, request):
        user_id = request.user.id  # F1, C1, M1, etc.
        user_email = request.user.email
        user_role = getattr(request.user, 'role', 'No role')
        
        print(f"🔐 Test Auth - User ID: {user_id}, Email: {user_email}, Role: {user_role}")
        
        return Response({
            'message': 'Authentication successful',
            'user_id': user_id,
            'username': getattr(request.user, 'name', 'No name'),
            'email': user_email,
            'role': user_role,
            'has_farmer': getattr(request.user, 'has_farmer', False),
            'has_customer': getattr(request.user, 'has_customer', False)
        })
