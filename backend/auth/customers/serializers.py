# customers/serializers.py
from rest_framework import serializers
from .models import CustomerOrder, OrderItem, CustomerCart
from farmers.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_details', 'product_name', 'quantity', 'unit_price']

class CustomerOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    farmer_name = serializers.CharField(source='farmer.name', read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    
    class Meta:
        model = CustomerOrder
        fields = [
            'id', 'order_id', 'farmer', 'farmer_name', 'customer_name',
            'total_amount', 'status', 'customer_address', 'customer_pincode',
            'farmer_address', 'farmer_pincode', 'order_date', 'delivery_date',
            'delivery_time', 'items', 'farmer_notified', 'customer_notified'
        ]
        read_only_fields = ['id', 'order_date']

class CustomerCartSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    
    class Meta:
        model = CustomerCart
        fields = ['id', 'product', 'product_details', 'quantity', 'added_at']