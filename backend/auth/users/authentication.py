# users/authentication.py - UPDATE with better ID handling
import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from .models import Farmer, Customer, MultiAccount

JWT_SECRET = settings.SECRET_KEY
JWT_ALGORITHM = 'HS256'


# users/authentication.py - UPDATE to handle role switching better
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
        user_role = payload.get('role', '')
        
        print(f"🔐 Authentication - User ID: {user_id}, Email: {user_email}, Role: {user_role}")

        # Find user based on role - SIMPLIFIED APPROACH
        user = None
        
        if user_role == 'farmer':
            user = Farmer.objects.filter(id=user_id).first()
            if user:
                print(f"✅ Authenticated as Farmer: {user.email}")
        elif user_role == 'customer':
            user = Customer.objects.filter(id=user_id).first()
            if user:
                print(f"✅ Authenticated as Customer: {user.email}")
        elif user_role == 'multi':
            user = MultiAccount.objects.filter(id=user_id).first()
            if user:
                print(f"✅ Authenticated as MultiAccount: {user.email}")
        else:
            # Fallback: Try all tables
            multi_account = MultiAccount.objects.filter(id=user_id).first()
            farmer = Farmer.objects.filter(id=user_id).first()
            customer = Customer.objects.filter(id=user_id).first()
            
            if multi_account:
                user = multi_account
                print(f"✅ Authenticated as MultiAccount (fallback): {user.email}")
            elif farmer:
                user = farmer
                print(f"✅ Authenticated as Farmer (fallback): {user.email}")
            elif customer:
                user = customer
                print(f"✅ Authenticated as Customer (fallback): {user.email}")

        if not user:
            print(f"❌ User not found - ID: {user_id}, Email: {user_email}, Role: {user_role}")
            raise AuthenticationFailed('User not found')
        
        # Verify email matches
        actual_email = getattr(user, 'email', None)
        if not actual_email and hasattr(user, 'farmer'):
            actual_email = user.farmer.email
        
        if actual_email and actual_email != user_email:
            print(f"❌ Email mismatch - JWT: {user_email}, User: {actual_email}")
            raise AuthenticationFailed('User data mismatch')
        
        # Add role information to user object
        user.role = user_role
        user.has_farmer = payload.get('has_farmer', False)
        user.has_customer = payload.get('has_customer', False)
        
        print(f"🎯 Final user object - Type: {type(user).__name__}, Role: {user.role}")
        
        return (user, token)
