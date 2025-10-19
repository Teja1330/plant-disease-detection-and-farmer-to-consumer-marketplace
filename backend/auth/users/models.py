from django.db import models
from django.core.validators import validate_email

class Farmer(models.Model):
    email = models.EmailField(unique=True, validators=[validate_email])
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        from django.contrib.auth.hashers import make_password
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"Farmer: {self.email}"

class Customer(models.Model):
    email = models.EmailField(unique=True, validators=[validate_email])
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        from django.contrib.auth.hashers import make_password
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"Customer: {self.email}"

class MultiAccount(models.Model):
    email = models.EmailField(unique=True, validators=[validate_email])
    password = models.CharField(max_length=255)
    farmer = models.OneToOneField(Farmer, on_delete=models.CASCADE)
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_password(self, raw_password):
        from django.contrib.auth.hashers import make_password
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"MultiAccount: {self.email}"