# customers/urls.py
from django.urls import path
from .views import MarketplaceView, CreateOrderView, CustomerOrdersView

urlpatterns = [
    path('marketplace/', MarketplaceView.as_view(), name='customer-marketplace'),
    path('orders/', CreateOrderView.as_view(), name='create-order'),
    path('orders/history/', CustomerOrdersView.as_view(), name='customer-orders'),
]