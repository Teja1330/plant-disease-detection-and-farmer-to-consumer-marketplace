from rest_framework import serializers
from .models import Farmer, Customer

class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = [
            'id', 'name', 'email', 'password', 
            'phone', 'street_address', 'city', 'district', 
            'state', 'country', 'pincode', 'created_at'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'id', 'name', 'email', 'password', 
            'phone', 'street_address', 'city', 'district', 
            'state', 'country', 'pincode', 'created_at'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance