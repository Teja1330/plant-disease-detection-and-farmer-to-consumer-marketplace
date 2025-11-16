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
            # Get customer's district and state for location-based filtering
            customer = Customer.objects.filter(id=request.user.id).first()
            if not customer:
                return Response({'detail': 'Customer profile not found'}, status=404)

            customer_district = customer.district
            customer_state = customer.state
            
            print(f"🔍 Customer location - District: {customer_district}, State: {customer_state}")
            
            # Get all active products
            products = Product.objects.filter(is_active=True).select_related('farmer')
            
            # If customer has district and state, filter by farmers in the same district AND state
            if customer_district and customer_state:
                products = products.filter(
                    farmer__district=customer_district,
                    farmer__state=customer_state
                )
                print(f"✅ Filtered products by district: {customer_district} and state: {customer_state}")
            else:
                print("⚠️ Customer address incomplete - showing all products")
            
            # Apply additional filters from query parameters
            category = request.GET.get('category')
            search = request.GET.get('search')
            
            if category and category != 'All':
                products = products.filter(category=category)
                print(f"✅ Filtered by category: {category}")
            
            if search:
                products = products.filter(name__icontains=search) | products.filter(farmer__name__icontains=search)
                print(f"✅ Filtered by search: {search}")
            
            # Enhance product data with farmer info
            enhanced_products = []
            for product in products:
                product_data = ProductSerializer(product).data
                product_data['farmer_name'] = product.farmer.name
                product_data['farmer_district'] = product.farmer.district or 'Unknown District'
                product_data['farmer_city'] = product.farmer.city or 'Unknown City'
                product_data['farmer_state'] = product.farmer.state or 'Unknown State'
                product_data['farmer_phone'] = product.farmer.phone
                enhanced_products.append(product_data)
            
            return Response({
                'products': enhanced_products,
                'customer_district': customer_district,
                'customer_state': customer_state,
                'total_products': products.count(),
                'filter_applied': bool(customer_district and customer_state)
            })
            
        except Exception as e:
            print(f"❌ Error in marketplace: {str(e)}")
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

            print(f"🛒 Creating order with {len(cart_items)} items for customer: {customer.email}")

            total_amount = 0
            order_items = []
            farmers_involved = set()

            # Validate cart items and calculate total
            for item in cart_items:
                product = get_object_or_404(Product, id=item['product_id'], is_active=True)
                
                # Check stock
                if product.stock < item['quantity']:
                    return Response({
                        'detail': f'Not enough stock for {product.name}. Available: {product.stock}'
                    }, status=400)
                
                item_total = float(product.price) * item['quantity']
                total_amount += item_total
                farmers_involved.add(product.farmer)
                
                order_items.append({
                    'product': product,
                    'quantity': item['quantity'],
                    'unit_price': float(product.price),
                    'item_total': item_total
                })

            # Check if all products are from the same farmer
            if len(farmers_involved) > 1:
                return Response({
                    'detail': 'All products in cart must be from the same farmer. Please place separate orders for different farmers.'
                }, status=400)

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

            # Create address string from customer's address fields
            address_parts = []
            if customer.street_address:
                address_parts.append(customer.street_address)
            if customer.city:
                address_parts.append(customer.city)
            if customer.district:
                address_parts.append(customer.district)
            if customer.state:
                address_parts.append(customer.state)
            if customer.pincode:
                address_parts.append(customer.pincode)
            
            delivery_address = ", ".join(address_parts) if address_parts else "Address not provided"

            # Create order
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
                address=delivery_address
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
            
            print(f"✅ Order created successfully: {order_id}")
            
            return Response({
                'message': 'Order placed successfully!',
                'order': serializer.data,
                'delivery_time': 'Within 5 hours',
                'order_id': order_id
            })
            
        except Exception as e:
            print(f"❌ Error creating order: {str(e)}")
            return Response({'detail': f'Failed to create order: {str(e)}'}, status=400)

    def send_farmer_notification(self, order):
        try:
            subject = f'New Order Received - {order.order_id}'
            message = f'''
            Hello {order.farmer.name},
            
            You have received a new order!
            
            Order ID: {order.order_id}
            Customer: {order.customer_name}
            Total Amount: ₹{order.total_amount}
            Delivery Address: {order.address}
            
            Please check your farmer dashboard for more details.
            
            Thank you,
            AgriCare Team
            '''
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [order.farmer.email],
                fail_silently=True,
            )
            print(f"📧 Notification sent to farmer: {order.farmer.email}")
        except Exception as e:
            print(f"❌ Failed to send farmer notification: {str(e)}")


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
            
            print(f"✅ Fetched {orders.count()} orders for customer: {customer.email}")
            
            return Response(serializer.data)
            
        except Exception as e:
            print(f"❌ Error fetching customer orders: {str(e)}")
            return Response({'detail': f'Failed to fetch orders: {str(e)}'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class CustomerCartView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]

    def get(self, request):
        """Get customer cart (currently handled by frontend localStorage)"""
        return Response({'message': 'Cart is managed by frontend localStorage'})

    def post(self, request):
        """Add to cart (currently handled by frontend localStorage)"""
        return Response({'message': 'Cart is managed by frontend localStorage'})

    def delete(self, request, item_id=None):
        """Remove from cart (currently handled by frontend localStorage)"""
        return Response({'message': 'Cart is managed by frontend localStorage'})

