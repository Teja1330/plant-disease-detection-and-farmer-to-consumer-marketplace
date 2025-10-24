# plant_detection/services.py
import os
import numpy as np
from django.conf import settings

try:
    import tensorflow as tf
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
    print("⚠️ TensorFlow not available. Plant detection will not work.")

class PlantDiseaseDetector:
    _instance = None
    _model = None
    _class_names = [
        'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
        'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 
        'Cherry_(including_sour)___healthy', 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 
        'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 
        'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 
        'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot',
        'Peach___healthy', 'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 
        'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy', 
        'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 
        'Strawberry___Leaf_scorch', 'Strawberry___healthy', 'Tomato___Bacterial_spot', 
        'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 
        'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 
        'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
        'Tomato___healthy'
    ]

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(PlantDiseaseDetector, cls).__new__(cls)
            if TENSORFLOW_AVAILABLE:
                cls._load_model()
            else:
                print("❌ TensorFlow not available. Plant detection disabled.")
        return cls._instance

    @classmethod
    def _load_model(cls):
        """Load the trained model (loads only once)"""
        try:
            # Try both .h5 and .keras extensions
            model_path_h5 = os.path.join(settings.BASE_DIR, 'plant_detection', 'models', 'trained_plant_disease_model.h5')
            model_path_keras = os.path.join(settings.BASE_DIR, 'plant_detection', 'models', 'trained_plant_disease_model.keras')
            
            model_path = None
            if os.path.exists(model_path_h5):
                model_path = model_path_h5
                print(f"✅ Found model with .h5 extension: {model_path}")
            elif os.path.exists(model_path_keras):
                model_path = model_path_keras
                print(f"✅ Found model with .keras extension: {model_path}")
            else:
                print("❌ Model file not found. Please ensure 'trained_plant_disease_model.h5' exists in plant_detection/models/")
                cls._model = None
                return

            print(f"🔄 Loading model from: {model_path}")
            
            try:
                # Try loading the model
                cls._model = tf.keras.models.load_model(model_path)
                print("✅ Model loaded successfully!")
                
            except Exception as e:
                print(f"⚠️ Model loading failed: {e}")
                print("💡 Trying alternative loading methods...")
                
                try:
                    # Try without compilation
                    cls._model = tf.keras.models.load_model(model_path, compile=False)
                    print("✅ Model loaded with compile=False!")
                except Exception as e2:
                    print(f"❌ Alternative loading failed: {e2}")
                    cls._model = None
                        
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            cls._model = None

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
            print(f"🔍 Input array range: {input_arr.min()} to {input_arr.max()}")
            
            # Normalize if needed (assuming model expects 0-1 range)
            input_arr = input_arr / 255.0
            
            # Make prediction
            predictions = self._model.predict(input_arr, verbose=0)
            
            print(f"🔍 Raw predictions shape: {predictions.shape}")
            
            # Get top 3 predictions for debugging
            top_3_indices = np.argsort(predictions[0])[-3:][::-1]
            top_3_confidences = predictions[0][top_3_indices]
            top_3_classes = [self._class_names[i] for i in top_3_indices]
            
            print("🔍 Top 3 predictions:")
            for i, (cls, conf) in enumerate(zip(top_3_classes, top_3_confidences)):
                print(f"   {i+1}. {cls}: {conf:.4f} ({conf*100:.2f}%)")
            
            # Get results
            result_index = np.argmax(predictions[0])
            confidence = float(predictions[0][result_index])
            prediction = self._class_names[result_index]
            
            print(f"🔍 Final prediction: {prediction} (confidence: {confidence:.4f})")
            
            return {
                "prediction": prediction,
                "confidence": confidence,
                "class_index": int(result_index),
                "top_predictions": list(zip(top_3_classes, top_3_confidences))
            }
            
        except Exception as e:
            print(f"❌ Prediction error: {e}")
            return {"error": f"Prediction failed: {str(e)}"}