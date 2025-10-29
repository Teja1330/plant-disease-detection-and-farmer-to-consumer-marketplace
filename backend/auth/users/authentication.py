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
        
        user_id = payload['id']  # This will be F1, C1, M1, etc.
        user_email = payload['email']
        user_role = payload.get('role', '')
        
        print(f"🔐 Authentication - User ID: {user_id}, Email: {user_email}, Role: {user_role}")

        # Find user based on prefix
        user = None
        
        if user_id.startswith('F'):
            user = Farmer.objects.filter(id=user_id).first()
            if user:
                print(f"✅ Authenticated as Farmer: {user.email}")
        elif user_id.startswith('C'):
            user = Customer.objects.filter(id=user_id).first()
            if user:
                print(f"✅ Authenticated as Customer: {user.email}")
        elif user_id.startswith('M'):
            user = MultiAccount.objects.filter(id=user_id).first()
            if user:
                print(f"✅ Authenticated as MultiAccount: {user.email}")
        else:
            # Fallback for any unexpected IDs
            user = Farmer.objects.filter(id=user_id).first()
            if not user:
                user = Customer.objects.filter(id=user_id).first()
            if not user:
                user = MultiAccount.objects.filter(id=user_id).first()

        if not user:
            print(f"❌ User not found - ID: {user_id}, Email: {user_email}, Role: {user_role}")
            raise AuthenticationFailed('User not found')
        
        # Verify email matches
        if hasattr(user, 'email') and user.email != user_email:
            print(f"❌ Email mismatch - JWT: {user_email}, User: {user.email}")
            raise AuthenticationFailed('User data mismatch')
        
        # Add role information
        user.role = user_role
        user.has_farmer = payload.get('has_farmer', False)
        user.has_customer = payload.get('has_customer', False)
        
        print(f"🎯 Final user object - Type: {type(user).__name__}, Role: {user.role}")
        
        return (user, token)