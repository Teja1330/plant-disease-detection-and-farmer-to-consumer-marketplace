# users/authentication.py
import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from .models import Farmer, Customer, MultiAccount

JWT_SECRET = settings.SECRET_KEY
JWT_ALGORITHM = 'HS256'

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
            
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
        
        user_id = payload['id']
        user_email = payload['email']
        
        # Find user in our custom tables
        user = None
        
        # Check MultiAccount first
        multi_account = MultiAccount.objects.filter(id=user_id).first()
        if multi_account:
            user = multi_account
        else:
            # Check individual tables
            farmer = Farmer.objects.filter(id=user_id).first()
            customer = Customer.objects.filter(id=user_id).first()
            
            if farmer:
                user = farmer
            elif customer:
                user = customer
        
        if not user:
            raise AuthenticationFailed('User not found')
        
        # Add role information to user object from JWT payload
        user.role = payload.get('role', '')
        user.has_farmer = payload.get('has_farmer', False)
        user.has_customer = payload.get('has_customer', False)
        
        return (user, token)