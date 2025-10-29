# users/models.py - COMPLETE REDESIGN
from django.db import models
from django.core.validators import validate_email
from django.contrib.auth.hashers import make_password, check_password

class Farmer(models.Model):
    id = models.CharField(max_length=10, primary_key=True)  # Changed to CharField for F1, F2, etc.
    email = models.EmailField(unique=True, validators=[validate_email])
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Address Fields
    street_address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True, default="India")
    pincode = models.CharField(max_length=10, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    # Django auth compatibility
    is_authenticated = True
    is_anonymous = False
    is_active = True

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def save(self, *args, **kwargs):
        if not self.id:
            # Auto-generate farmer ID: F1, F2, F3, etc.
            last_farmer = Farmer.objects.all().order_by('id').last()
            if last_farmer:
                last_id = int(last_farmer.id[1:])  # Remove 'F' prefix
                self.id = f'F{last_id + 1}'
            else:
                self.id = 'F1'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Farmer: {self.name} ({self.id})"

class Customer(models.Model):
    id = models.CharField(max_length=10, primary_key=True)  # Changed to CharField for C1, C2, etc.
    email = models.EmailField(unique=True, validators=[validate_email])
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Address Fields
    street_address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True, default="India")
    pincode = models.CharField(max_length=10, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    # Django auth compatibility
    is_authenticated = True
    is_anonymous = False
    is_active = True

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def save(self, *args, **kwargs):
        if not self.id:
            # Auto-generate customer ID: C1, C2, C3, etc.
            last_customer = Customer.objects.all().order_by('id').last()
            if last_customer:
                last_id = int(last_customer.id[1:])  # Remove 'C' prefix
                self.id = f'C{last_id + 1}'
            else:
                self.id = 'C1'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Customer: {self.name} ({self.id})"

class MultiAccount(models.Model):
    id = models.CharField(max_length=10, primary_key=True)  # Changed to CharField for M1, M2, etc.
    email = models.EmailField(unique=True, validators=[validate_email])
    password = models.CharField(max_length=255)
    farmer = models.OneToOneField(Farmer, on_delete=models.CASCADE)
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    # Django auth compatibility
    is_authenticated = True
    is_anonymous = False
    is_active = True

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def save(self, *args, **kwargs):
        if not self.id:
            # Auto-generate multiaccount ID: M1, M2, M3, etc.
            last_multi = MultiAccount.objects.all().order_by('id').last()
            if last_multi:
                last_id = int(last_multi.id[1:])  # Remove 'M' prefix
                self.id = f'M{last_id + 1}'
            else:
                self.id = 'M1'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"MultiAccount: {self.email} ({self.id})"
