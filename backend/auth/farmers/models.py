# farmers/models.py
from django.db import models
from django.core.validators import MinValueValidator


# farmers/models.py - Update the Product model
class Product(models.Model):
    farmer = models.ForeignKey('users.Farmer', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50)
    description = models.TextField()
    category = models.CharField(max_length=100)
    stock = models.IntegerField(default=0)
    
    # Store image as binary data
    image = models.BinaryField(null=True, blank=True)
    image_name = models.CharField(max_length=255, null=True, blank=True)
    image_content_type = models.CharField(max_length=100, null=True, blank=True)
    
    organic = models.BooleanField(default=False)
    harvest_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)  # Changed to True by default

    def __str__(self):
        return f"{self.name} - {self.farmer.name}"

class Order(models.Model):
    ORDER_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    farmer = models.ForeignKey('users.Farmer', on_delete=models.CASCADE)
    order_id = models.CharField(max_length=50, unique=True)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    order_date = models.DateField()
    delivery_date = models.DateField()
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.order_id} - {self.customer_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='farmer_order_items')  # CHANGED: added related_name
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} - {self.quantity}"

class FarmerStats(models.Model):
    farmer = models.OneToOneField('users.Farmer', on_delete=models.CASCADE)
    total_products = models.IntegerField(default=0)
    total_orders = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    pending_orders = models.IntegerField(default=0)
    completed_orders = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Stats - {self.farmer.name}"