from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from farmers.models import Product, Order, OrderItem
from users.models import Customer, Farmer
from users.permissions import IsAuthenticatedWithJWT
from farmers.serializers import ProductSerializer, OrderSerializer
import json
from datetime import datetime, timedelta
import random
import string


@method_decorator(csrf_exempt, name='dispatch')
class MarketplaceView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]

    def get(self, request):
        try:
            # Get customer's district for location-based filtering
            customer = Customer.objects.filter(id=request.user.id).first()
            if not customer:
                return Response({'detail': 'Customer profile not found'}, status=404)

            customer_district = customer.district
            
            # Get all active products
            products = Product.objects.filter(is_active=True).select_related('farmer')
            
            # If customer has district, filter by farmers in the same district
            if customer_district:
                # Get products from farmers in the same district
                products = products.filter(farmer__district=customer_district)
            
            # Apply additional filters from query parameters
            category = request.GET.get('category')
            search = request.GET.get('search')
            
            if category and category != 'All':
                products = products.filter(category=category)
            
            if search:
                products = products.filter(name__icontains=search) | products.filter(farmer__name__icontains=search)
            
            # Enhance product data with farmer info
            enhanced_products = []
            for product in products:
                product_data = ProductSerializer(product).data
                product_data['farmer_name'] = product.farmer.name
                product_data['farmer_district'] = product.farmer.district or 'Unknown District'
                product_data['farmer_city'] = product.farmer.city or 'Unknown City'
                product_data['farmer_phone'] = product.farmer.phone
                enhanced_products.append(product_data)
            
            return Response({
                'products': enhanced_products,
                'customer_district': customer_district,
                'total_products': products.count()
            })
            
        except Exception as e:
            return Response({'detail': f'Failed to fetch marketplace: {str(e)}'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class CreateOrderView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]

    def post(self, request):
        try:
            customer = Customer.objects.filter(id=request.user.id).first()
            if not customer:
                return Response({'detail': 'Customer profile not found'}, status=404)

            cart_items = request.data.get('cart_items', [])
            if not cart_items:
                return Response({'detail': 'Cart is empty'}, status=400)

            total_amount = 0
            order_items = []

            # Validate cart items and calculate total
            for item in cart_items:
                product = get_object_or_404(Product, id=item['product_id'], is_active=True)
                if product.stock < item['quantity']:
                    return Response({
                        'detail': f'Not enough stock for {product.name}. Available: {product.stock}'
                    }, status=400)
                
                item_total = float(product.price) * item['quantity']
                total_amount += item_total
                
                order_items.append({
                    'product': product,
                    'quantity': item['quantity'],
                    'unit_price': float(product.price),
                    'item_total': item_total
                })

            # Generate unique order ID
            def generate_unique_order_id():
                timestamp = datetime.now().strftime('%Y%m%d')
                random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
                order_id = f"ORD-{timestamp}-{random_suffix}"
                
                # Check if order ID already exists
                while Order.objects.filter(order_id=order_id).exists():
                    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
                    order_id = f"ORD-{timestamp}-{random_suffix}"
                
                return order_id

            order_id = generate_unique_order_id()
            delivery_date = datetime.now() + timedelta(hours=5)

            # Create order with the first product's farmer
            order = Order.objects.create(
                farmer=order_items[0]['product'].farmer,
                order_id=order_id,
                customer_name=customer.name,
                customer_email=customer.email,
                customer_phone=customer.phone or '',
                order_date=datetime.now().date(),
                delivery_date=delivery_date.date(),
                status='pending',
                total_amount=total_amount,
                address=customer.address or ''
            )

            # Create order items and update stock
            for item in order_items:
                OrderItem.objects.create(
                    order=order,
                    product=item['product'],
                    quantity=item['quantity'],
                    unit_price=item['unit_price']
                )
                
                # Update product stock
                item['product'].stock -= item['quantity']
                item['product'].save()

            # Send notification to farmer
            self.send_farmer_notification(order)

            serializer = OrderSerializer(order)
            
            return Response({
                'message': 'Order placed successfully!',
                'order': serializer.data,
                'delivery_time': 'Within 5 hours'
            })
            
        except Exception as e:
            return Response({'detail': f'Failed to create order: {str(e)}'}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class CustomerOrdersView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]

    def get(self, request):
        try:
            customer = Customer.objects.filter(id=request.user.id).first()
            if not customer:
                return Response({'detail': 'Customer profile not found'}, status=404)

            # Get orders by customer email
            orders = Order.objects.filter(customer_email=customer.email).order_by('-created_at')
            serializer = OrderSerializer(orders, many=True)
            
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'detail': f'Failed to fetch orders: {str(e)}'}, status=400)