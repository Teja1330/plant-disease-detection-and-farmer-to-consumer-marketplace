# plant_detection/serializers.py
from rest_framework import serializers
from .models import PlantDetectionResult

class PlantDetectionResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantDetectionResult
        fields = ['id', 'image', 'prediction', 'confidence', 'created_at']

class PlantDetectionRequestSerializer(serializers.Serializer):
    image = serializers.ImageField()

# plant_detection/services.py - Update the predict method
def predict(self, image_path):
    """Make prediction on a plant image"""
    if not TENSORFLOW_AVAILABLE:
        return {"error": "TensorFlow not installed"}
    
    if self._model is None:
        return {"error": "Model not loaded"}
    
    try:
        print(f"🔍 Making prediction on image: {image_path}")
        
        # Preprocess the image
        image = tf.keras.preprocessing.image.load_img(image_path, target_size=(128, 128))
        input_arr = tf.keras.preprocessing.image.img_to_array(image)
        input_arr = np.array([input_arr])  # Convert single image to batch
        
        print(f"🔍 Input array shape: {input_arr.shape}")
        
        # Make prediction
        predictions = self._model.predict(input_arr, verbose=0)
        
        print(f"🔍 Raw predictions shape: {predictions.shape}")
        print(f"🔍 Raw predictions sample: {predictions[0][:5]}")  # First 5 values
        
        # Get results
        result_index = np.argmax(predictions[0])
        confidence = float(predictions[0][result_index])
        prediction = self._class_names[result_index]
        
        print(f"🔍 Final prediction: {prediction} (confidence: {confidence})")
        
        return {
            "prediction": prediction,
            "confidence": confidence,
            "class_index": int(result_index)
        }
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return {"error": f"Prediction failed: {str(e)}"}