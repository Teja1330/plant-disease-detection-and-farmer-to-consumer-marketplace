from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Sum, Count, Q
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage

from datetime import datetime
from .models import Product, Order, OrderItem, FarmerStats
from .serializers import ProductSerializer, OrderSerializer, FarmerStatsSerializer
from users.permissions import IsAuthenticatedWithJWT, IsFarmerOrMultiAccount
from users.models import Farmer, MultiAccount, Customer
import logging

logger = logging.getLogger(__name__)


def get_farmer_instance(user):
    """
    Get Farmer instance from any user type (Farmer, Customer, MultiAccount)
    """
    # If user is directly a Farmer
    if isinstance(user, Farmer):
        return user
    
    # If user is MultiAccount
    if isinstance(user, MultiAccount):
        return user.farmer
    
    # If user is Customer or other type, try to find by email
    try:
        return Farmer.objects.get(email=user.email)
    except Farmer.DoesNotExist:
        return None


@method_decorator(csrf_exempt, name='dispatch')
class FarmerDashboardView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]

    def get(self, request):
        try:
            farmer_instance = get_farmer_instance(request.user)
            
            if not farmer_instance:
                return Response({'detail': 'Farmer profile not found'}, status=404)

            print(f"📊 Fetching dashboard for farmer: {farmer_instance.name} (ID: {farmer_instance.id})")
            
            # Get or create farmer stats
            stats, created = FarmerStats.objects.get_or_create(farmer_id=farmer_instance.id)
            
            # Update stats with real-time data
            stats.total_products = Product.objects.filter(farmer_id=farmer_instance.id, is_active=True).count()
            stats.total_orders = Order.objects.filter(farmer_id=farmer_instance.id).count()
            
            revenue_data = Order.objects.filter(
                farmer_id=farmer_instance.id, 
                status='completed'
            ).aggregate(total=Sum('total_amount'))
            stats.total_revenue = revenue_data['total'] or 0
            
            stats.pending_orders = Order.objects.filter(farmer_id=farmer_instance.id, status='pending').count()
            stats.completed_orders = Order.objects.filter(farmer_id=farmer_instance.id, status='completed').count()
            stats.save()
            
            # Get recent orders (last 5)
            recent_orders = Order.objects.filter(farmer_id=farmer_instance.id).order_by('-created_at')[:5]
            
            # Get low stock products (stock < 10)
            low_stock_products = Product.objects.filter(
                farmer_id=farmer_instance.id, 
                stock__lt=10, 
                is_active=True
            )[:5]
            
            # Get today's orders
            today_orders = Order.objects.filter(
                farmer_id=farmer_instance.id,
                created_at__date=datetime.now().date()
            ).count()
            
            serializer = FarmerStatsSerializer(stats)
            orders_serializer = OrderSerializer(recent_orders, many=True)
            products_serializer = ProductSerializer(low_stock_products, many=True)
            
            response_data = {
                'stats': serializer.data,
                'recent_orders': orders_serializer.data,
                'low_stock_products': products_serializer.data,
                'today_orders': today_orders,
                'farmer_info': {
                    'name': farmer_instance.name,
                    'email': farmer_instance.email,
                    'district': farmer_instance.district,
                    'state': farmer_instance.state,
                    'has_complete_address': bool(
                        farmer_instance.street_address and
                        farmer_instance.city and
                        farmer_instance.district and
                        farmer_instance.state and
                        farmer_instance.pincode
                    )
                }
            }
            
            print(f"✅ Dashboard data fetched successfully for farmer {farmer_instance.id}")
            return Response(response_data)
            
        except Exception as e:
            print(f"❌ Error fetching dashboard data: {str(e)}")
            return Response({'detail': f'Failed to fetch dashboard data: {str(e)}'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class ProductListView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]

    def get(self, request):
        """Handle GET request to list products"""
        try:
            farmer_instance = get_farmer_instance(request.user)
            
            if not farmer_instance:
                return Response({'detail': 'Farmer profile not found'}, status=404)
            
            print(f"🔍 Fetching products for farmer: {farmer_instance.name} (ID: {farmer_instance.id})")
            
            products = Product.objects.filter(farmer=farmer_instance, is_active=True).order_by('-created_at')
            serializer = ProductSerializer(products, many=True)
            
            print(f"✅ Found {len(products)} products for farmer {farmer_instance.id}")
            return Response(serializer.data)
            
        except Exception as e:
            print(f"❌ Error fetching products: {str(e)}")
            return Response({'detail': f'Failed to fetch products: {str(e)}'}, status=400)

    def post(self, request):
        try:
            farmer_instance = get_farmer_instance(request.user)
            
            if not farmer_instance:
                return Response({
                    'detail': 'Farmer profile not found. Please register as a farmer first.'
                }, status=404)

            # Check if farmer has complete address
            if not all([
                farmer_instance.street_address,
                farmer_instance.city,
                farmer_instance.district,
                farmer_instance.state,
                farmer_instance.pincode
            ]):
                return Response({
                    'detail': 'Please complete your farm address before adding products. You can update it in your profile.'
                }, status=400)
            
            print(f"🔍 Creating product for farmer: {farmer_instance.name} (ID: {farmer_instance.id})")
            print(f"🔍 Request data: {request.data}")
            print(f"🔍 Request files: {request.FILES}")
            
            # Prepare data for serializer
            data = request.data.copy()
            
            # Remove farmer from data since we'll set it in context
            if 'farmer' in data:
                del data['farmer']
            
            # Create serializer with request context for file handling
            serializer = ProductSerializer(
                data=data, 
                context={
                    'farmer': farmer_instance,
                    'request': request
                }
            )
            
            if serializer.is_valid():
                print("✅ Serializer is valid, creating product...")
                product = serializer.save()
                print(f"✅ Product created successfully - ID: {product.id}, Name: {product.name}")
                
                # Return the created product with image URL
                response_data = ProductSerializer(product).data
                return Response(response_data, status=201)
            else:
                print("❌ Serializer errors:", serializer.errors)
                return Response({
                    'detail': 'Invalid product data',
                    'errors': serializer.errors
                }, status=400)
                
        except Exception as e:
            print(f"❌ Exception in product creation: {str(e)}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
            return Response({'detail': f'Failed to create product: {str(e)}'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class ProductDetailView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]

    def get(self, request, product_id):
        try:
            farmer_instance = get_farmer_instance(request.user)
            product = get_object_or_404(Product, id=product_id, farmer=farmer_instance)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': f'Failed to fetch product: {str(e)}'}, status=400)

    def patch(self, request, product_id):
        try:
            farmer_instance = get_farmer_instance(request.user)
            product = get_object_or_404(Product, id=product_id, farmer=farmer_instance)
            
            serializer = ProductSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response({
                'detail': 'Invalid product data',
                'errors': serializer.errors
            }, status=400)
        except Exception as e:
            return Response({'detail': f'Failed to update product: {str(e)}'}, status=400)

    def delete(self, request, product_id):
        try:
            farmer_instance = get_farmer_instance(request.user)
            product = get_object_or_404(Product, id=product_id, farmer=farmer_instance)
            
            # Soft delete by setting is_active to False
            product.is_active = False
            product.save()
            
            print(f"✅ Product deleted (soft): {product.name} (ID: {product.id})")
            return Response({'detail': 'Product deleted successfully'})
        except Exception as e:
            print(f"❌ Error deleting product: {str(e)}")
            return Response({'detail': f'Failed to delete product: {str(e)}'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class OrderListView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]

    def get(self, request):
        try:
            farmer_instance = get_farmer_instance(request.user)
            
            if not farmer_instance:
                return Response({'detail': 'Farmer profile not found'}, status=404)
                
            orders = Order.objects.filter(farmer_id=farmer_instance.id).order_by('-created_at')
            serializer = OrderSerializer(orders, many=True)
            
            print(f"✅ Fetched {orders.count()} orders for farmer {farmer_instance.id}")
            return Response(serializer.data)
        except Exception as e:
            print(f"❌ Error fetching orders: {str(e)}")
            return Response({'detail': f'Failed to fetch orders: {str(e)}'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class OrderDetailView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]

    def get(self, request, order_id):
        try:
            farmer_instance = get_farmer_instance(request.user)
            order = get_object_or_404(Order, id=order_id, farmer_id=farmer_instance.id)
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': f'Failed to fetch order: {str(e)}'}, status=400)

    def patch(self, request, order_id):
        try:
            farmer_instance = get_farmer_instance(request.user)
            order = get_object_or_404(Order, id=order_id, farmer_id=farmer_instance.id)
            
            new_status = request.data.get('status')
            valid_statuses = ['pending', 'confirmed', 'shipped', 'completed', 'cancelled']
            
            if new_status not in valid_statuses:
                return Response({'detail': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}, status=400)
            
            order.status = new_status
            order.save()
            
            serializer = OrderSerializer(order)
            
            print(f"✅ Order {order_id} status updated to: {new_status}")
            return Response(serializer.data)
        except Exception as e:
            print(f"❌ Error updating order: {str(e)}")
            return Response({'detail': f'Failed to update order: {str(e)}'}, status=400)
