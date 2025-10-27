# farmers/serializers.py
from rest_framework import serializers
from .models import Product, Order, OrderItem, FarmerStats


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
        if obj.image:
            import base64
            encoded_image = base64.b64encode(obj.image).decode('utf-8')
            return f"data:image/jpeg;base64,{encoded_image}"
        return None

    def create(self, validated_data):
        print("🔍 Creating product with validated data:", validated_data)
        
        # Get the farmer instance from context
        farmer = self.context.get('farmer')
        if not farmer:
            raise serializers.ValidationError("Farmer instance is required")
        
        print(f"🔍 Using farmer instance: {farmer.name} (ID: {farmer.id})")
        
        # Handle image file if present
        image_file = validated_data.pop('image', None)
        if image_file:
            # Read the image file and store as binary
            validated_data['image'] = image_file.read()
        
        # Create the product with the farmer instance
        validated_data['farmer'] = farmer
        product = Product.objects.create(**validated_data)
        
        print(f"✅ Product created successfully - ID: {product.id}")
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