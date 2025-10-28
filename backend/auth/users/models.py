from django.db import models
from django.core.validators import validate_email
from django.contrib.auth.hashers import make_password, check_password

class Farmer(models.Model):
    email = models.EmailField(unique=True, validators=[validate_email])
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Complete Address Fields
    street_address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True, default="India")
    pincode = models.CharField(max_length=10, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    # Add Django auth compatibility attributes
    is_authenticated = True
    is_anonymous = False
    is_active = True

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"Farmer: {self.name}"

class Customer(models.Model):
    email = models.EmailField(unique=True, validators=[validate_email])
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Complete Address Fields
    street_address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True, default="India")
    pincode = models.CharField(max_length=10, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    # Add Django auth compatibility attributes
    is_authenticated = True
    is_anonymous = False
    is_active = True

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"Customer: {self.name}"

class MultiAccount(models.Model):
    email = models.EmailField(unique=True, validators=[validate_email])
    password = models.CharField(max_length=255)
    farmer = models.OneToOneField(Farmer, on_delete=models.CASCADE)
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    # Add Django auth compatibility attributes
    is_authenticated = True
    is_anonymous = False
    is_active = True

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"MultiAccount: {self.email}"