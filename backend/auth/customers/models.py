# customers/models.py
from django.db import models
from django.core.validators import MinValueValidator

class CustomerOrder(models.Model):
    ORDER_STATUS = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey('users.Customer', on_delete=models.CASCADE)
    farmer = models.ForeignKey('users.Farmer', on_delete=models.CASCADE)
    order_id = models.CharField(max_length=50, unique=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending')
    customer_address = models.TextField()
    customer_pincode = models.CharField(max_length=10)
    farmer_address = models.TextField()
    farmer_pincode = models.CharField(max_length=10)
    order_date = models.DateTimeField(auto_now_add=True)
    delivery_date = models.DateField(null=True, blank=True)
    delivery_time = models.CharField(max_length=50, blank=True, null=True)
    
    # Notification fields
    farmer_notified = models.BooleanField(default=False)
    customer_notified = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-order_date']

    def __str__(self):
        return f"{self.order_id} - {self.customer.name}"

class OrderItem(models.Model):
    order = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('farmers.Product', on_delete=models.CASCADE, related_name='customer_order_items')  # CHANGED: added related_name
    product_name = models.CharField(max_length=255)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.product_name} - {self.quantity}"

class CustomerCart(models.Model):
    customer = models.ForeignKey('users.Customer', on_delete=models.CASCADE)
    product = models.ForeignKey('farmers.Product', on_delete=models.CASCADE, related_name='customer_cart_items')  # CHANGED: added related_name
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['customer', 'product']

    def __str__(self):
        return f"{self.customer.name} - {self.product.name}"