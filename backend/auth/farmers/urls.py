# farmers/urls.py - Make sure it has ALL the endpoints
from django.urls import path
from .views import ProductListView, ProductDetailView, FarmerDashboardView, OrderListView, OrderDetailView

urlpatterns = [
    path('dashboard/', FarmerDashboardView.as_view(), name='farmer-dashboard'),
    path('products/', ProductListView.as_view(), name='farmer-products'),
    path('products/<int:product_id>/', ProductDetailView.as_view(), name='farmer-product-detail'),
    path('orders/', OrderListView.as_view(), name='farmer-orders'),
    path('orders/<int:order_id>/', OrderDetailView.as_view(), name='farmer-order-detail'),
]