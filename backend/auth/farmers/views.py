# farmers/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Sum, Count
from django.shortcuts import get_object_or_404

from .models import Product, Order, OrderItem, FarmerStats
from .serializers import ProductSerializer, OrderSerializer, FarmerStatsSerializer
from users.permissions import IsAuthenticatedWithJWT, IsFarmerOrMultiAccount

@method_decorator(csrf_exempt, name='dispatch')
class FarmerDashboardView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]

    def get(self, request):
        try:
            farmer_id = request.user.id
            
            # Get farmer stats
            stats, created = FarmerStats.objects.get_or_create(farmer_id=farmer_id)
            
            # Update stats with real-time data
            stats.total_products = Product.objects.filter(farmer_id=farmer_id, is_active=True).count()
            stats.total_orders = Order.objects.filter(farmer_id=farmer_id).count()
            stats.total_revenue = Order.objects.filter(
                farmer_id=farmer_id, 
                status='completed'
            ).aggregate(total=Sum('total_amount'))['total'] or 0
            stats.pending_orders = Order.objects.filter(farmer_id=farmer_id, status='pending').count()
            stats.completed_orders = Order.objects.filter(farmer_id=farmer_id, status='completed').count()
            stats.save()
            
            # Get recent orders
            recent_orders = Order.objects.filter(farmer_id=farmer_id).order_by('-created_at')[:5]
            
            # Get low stock products
            low_stock_products = Product.objects.filter(
                farmer_id=farmer_id, 
                stock__lt=10, 
                is_active=True
            )[:5]
            
            serializer = FarmerStatsSerializer(stats)
            orders_serializer = OrderSerializer(recent_orders, many=True)
            products_serializer = ProductSerializer(low_stock_products, many=True)
            
            return Response({
                'stats': serializer.data,
                'recent_orders': orders_serializer.data,
                'low_stock_products': products_serializer.data
            })
            
        except Exception as e:
            return Response({'detail': f'Failed to fetch dashboard data: {str(e)}'}, status=400)

# farmers/views.py - Universal farmer resolution
def get_farmer_instance(user):
    """
    Get Farmer instance from any user type (Farmer, Customer, MultiAccount)
    """
    from users.models import Farmer, MultiAccount
    
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
class ProductListView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]

    def get(self, request):
        """Handle GET request to list products"""
        try:
            print("🔍 Fetching products for user:", request.user.id)
            farmer_instance = get_farmer_instance(request.user)
            
            if not farmer_instance:
                return Response({'detail': 'Farmer profile not found'}, status=404)
            
            products = Product.objects.filter(farmer=farmer_instance, is_active=True)
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
            
            print(f"🔍 Using farmer: {farmer_instance.name} (ID: {farmer_instance.id})")
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
                print(f"✅ Product created successfully - ID: {product.id}")
                
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

    def delete(self, request, product_id):
        try:
            farmer_id = request.user.id
            product = get_object_or_404(Product, id=product_id, farmer_id=farmer_id)
            product.is_active = False
            product.save()
            return Response({'detail': 'Product deleted successfully'})
        except Exception as e:
            return Response({'detail': f'Failed to delete product: {str(e)}'}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class OrderListView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]

    def get(self, request):
        try:
            farmer_id = request.user.id
            orders = Order.objects.filter(farmer_id=farmer_id).order_by('-created_at')
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': f'Failed to fetch orders: {str(e)}'}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class OrderDetailView(APIView):
    permission_classes = [IsAuthenticatedWithJWT, IsFarmerOrMultiAccount]

    def patch(self, request, order_id):
        try:
            farmer_id = request.user.id
            order = get_object_or_404(Order, id=order_id, farmer_id=farmer_id)
            
            new_status = request.data.get('status')
            if new_status not in dict(Order.ORDER_STATUS):
                return Response({'detail': 'Invalid status'}, status=400)
            
            order.status = new_status
            order.save()
            
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': f'Failed to update order: {str(e)}'}, status=400)