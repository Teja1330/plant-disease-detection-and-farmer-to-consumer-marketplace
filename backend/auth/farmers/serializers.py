# farmers/serializers.py
from rest_framework import serializers
from .models import Product, Order, OrderItem, FarmerStats
import base64


# farmers/serializers.py - Update the create method
class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'unit', 'description', 'category', 
            'stock', 'image_url', 'organic', 'harvest_date', 'created_at',
            'is_active'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'image_url']

    def get_image_url(self, obj):
        """Generate base64 data URL for the image"""
        if obj.image:
            try:
                encoded_image = base64.b64encode(obj.image).decode('utf-8')
                content_type = obj.image_content_type or 'image/jpeg'
                return f"data:{content_type};base64,{encoded_image}"
            except Exception as e:
                print(f"Error encoding image for product {obj.id}: {e}")
                return None
        return None

    def create(self, validated_data):
        print("🔍 Creating product with validated data")
        
        # Get the farmer instance from context
        farmer = self.context.get('farmer')
        if not farmer:
            raise serializers.ValidationError("Farmer instance is required")
        
        print(f"🔍 Using farmer instance: {farmer.name} (ID: {farmer.id})")
        
        # Handle image file from request
        request = self.context.get('request')
        if request and hasattr(request, 'FILES') and 'image' in request.FILES:
            image_file = request.FILES['image']
            
            # Read image data and store as binary
            validated_data['image'] = image_file.read()
            validated_data['image_name'] = image_file.name
            validated_data['image_content_type'] = image_file.content_type
            
            print(f"📷 Image uploaded: {image_file.name} ({image_file.content_type})")
        else:
            print("📷 No image uploaded")
        
        # Set is_active to True for new products
        validated_data['is_active'] = True
        
        # Create the product with the farmer instance
        validated_data['farmer'] = farmer
        product = Product.objects.create(**validated_data)
        
        print(f"✅ Product created successfully - ID: {product.id}, is_active: {product.is_active}")
        return product


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'customer_name', 'customer_email', 'customer_phone',
            'order_date', 'delivery_date', 'status', 'total_amount', 'address',
            'items', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class FarmerStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FarmerStats
        fields = [
            'total_products', 'total_orders', 'total_revenue',
            'pending_orders', 'completed_orders', 'updated_at'
        ]