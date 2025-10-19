from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import FarmerSerializer, CustomerSerializer
from .models import Farmer, Customer, MultiAccount
import jwt, datetime
from django.conf import settings
import re

JWT_SECRET = settings.SECRET_KEY
JWT_ALGORITHM = 'HS256'

def create_multiaccount(email, password, farmer, customer):
    """Create MultiAccount entry and delete individual entries"""
    try:
        # Create MultiAccount
        multi_account = MultiAccount.objects.create(
            email=email,
            password=password,
            farmer=farmer,
            customer=customer
        )
        multi_account.set_password(password)
        multi_account.save()
        
        # Delete individual entries (they're now referenced via MultiAccount)
        # Note: We don't delete them as they're linked via OneToOneField
        return multi_account
    except Exception as e:
        print(f"Error creating MultiAccount: {e}")
        return None

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email', '').strip().lower()
            password = request.data.get('password', '')
            name = request.data.get('name', '').strip()
            role = request.data.get('role', '').strip().lower()

            # Basic validations
            if not all([email, password, name, role]):
                return Response({'detail': 'All fields are required.'}, status=400)

            if role not in ['farmer', 'customer']:
                return Response({'detail': 'Invalid role.'}, status=400)

            # Email validation
            if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
                return Response({'detail': 'Invalid email format.'}, status=400)

            # Password validation
            if len(password) < 6:
                return Response({'detail': 'Password must be at least 6 characters.'}, status=400)

            # Check if user already has this role
            existing_farmer = Farmer.objects.filter(email=email).first()
            existing_customer = Customer.objects.filter(email=email).first()
            multi_account = MultiAccount.objects.filter(email=email).first()

            # If user already has MultiAccount, they can't register again
            if multi_account:
                return Response({'detail': 'This email already has both farmer and customer accounts.'}, status=400)

            if role == 'farmer' and existing_farmer:
                return Response({'detail': 'Email already registered as farmer.'}, status=400)
            if role == 'customer' and existing_customer:
                return Response({'detail': 'Email already registered as customer.'}, status=400)

            # Create user based on role
            user_data = {'email': email, 'name': name, 'password': password}
            user_instance = None
            has_farmer = False
            has_customer = False

            if role == 'farmer':
                serializer = FarmerSerializer(data=user_data)
                if serializer.is_valid():
                    farmer = serializer.save()
                    user_instance = farmer
                    has_farmer = True
                    has_customer = existing_customer is not None
                    
                    # If user now has both accounts, create MultiAccount
                    if existing_customer:
                        multi_account = create_multiaccount(email, password, farmer, existing_customer)
                        if multi_account:
                            user_instance = multi_account
                else:
                    return Response(serializer.errors, status=400)
            else:  # customer
                serializer = CustomerSerializer(data=user_data)
                if serializer.is_valid():
                    customer = serializer.save()
                    user_instance = customer
                    has_farmer = existing_farmer is not None
                    has_customer = True
                    
                    # If user now has both accounts, create MultiAccount
                    if existing_farmer:
                        multi_account = create_multiaccount(email, password, existing_farmer, customer)
                        if multi_account:
                            user_instance = multi_account
                else:
                    return Response(serializer.errors, status=400)

            # Generate token
            payload = {
                'id': user_instance.id,
                'email': user_instance.email,
                'role': role,
                'has_farmer': has_farmer or MultiAccount.objects.filter(email=email).exists(),
                'has_customer': has_customer or MultiAccount.objects.filter(email=email).exists(),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
                'iat': datetime.datetime.utcnow(),
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

            return Response({
                'message': 'Registration successful',
                'token': token,
                'user': {
                    'id': user_instance.id,
                    'name': getattr(user_instance, 'name', name),
                    'email': user_instance.email,
                    'role': role,
                    'has_farmer': has_farmer or MultiAccount.objects.filter(email=email).exists(),
                    'has_customer': has_customer or MultiAccount.objects.filter(email=email).exists()
                }
            })
                
        except Exception as e:
            return Response({'detail': f'Registration failed: {str(e)}'}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email', '').strip().lower()
            password = request.data.get('password', '')

            if not email or not password:
                return Response({'detail': 'Email and password required.'}, status=400)

            user_instance = None
            role = None
            has_farmer = False
            has_customer = False

            # Check MultiAccount first
            multi_account = MultiAccount.objects.filter(email=email).first()
            if multi_account and multi_account.check_password(password):
                user_instance = multi_account
                has_farmer = True
                has_customer = True
                role = 'multi'  # Special role indicating both accounts
            else:
                # Check individual tables
                farmer = Farmer.objects.filter(email=email).first()
                customer = Customer.objects.filter(email=email).first()
                
                if farmer and farmer.check_password(password):
                    user_instance = farmer
                    role = 'farmer'
                    has_farmer = True
                    has_customer = Customer.objects.filter(email=email).exists() or MultiAccount.objects.filter(email=email).exists()
                elif customer and customer.check_password(password):
                    user_instance = customer
                    role = 'customer'
                    has_farmer = Farmer.objects.filter(email=email).exists() or MultiAccount.objects.filter(email=email).exists()
                    has_customer = True
                else:
                    return Response({'detail': 'Invalid credentials.'}, status=400)

            # Generate token
            payload = {
                'id': user_instance.id,
                'email': user_instance.email,
                'role': role,
                'has_farmer': has_farmer,
                'has_customer': has_customer,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
                'iat': datetime.datetime.utcnow(),
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

            return Response({
                'message': 'Login successful',
                'token': token,
                'user': {
                    'id': user_instance.id,
                    'name': getattr(user_instance, 'name', ''),
                    'email': user_instance.email,
                    'role': role,
                    'has_farmer': has_farmer,
                    'has_customer': has_customer
                }
            })
            
        except Exception as e:
            return Response({'detail': f'Login failed: {str(e)}'}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
class UserView(APIView):
    def get(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'detail': 'Unauthenticated.'}, status=401)
            
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except:
            return Response({'detail': 'Invalid token.'}, status=401)

        # Find user
        user_id = payload['id']
        user_instance = None
        has_farmer = False
        has_customer = False
        
        # Check MultiAccount
        multi_account = MultiAccount.objects.filter(id=user_id).first()
        if multi_account:
            user_instance = multi_account
            has_farmer = True
            has_customer = True
        else:
            # Check individual tables
            farmer = Farmer.objects.filter(id=user_id).first()
            customer = Customer.objects.filter(id=user_id).first()
            
            if farmer:
                user_instance = farmer
                has_farmer = True
                has_customer = Customer.objects.filter(email=user_instance.email).exists() or MultiAccount.objects.filter(email=user_instance.email).exists()
            elif customer:
                user_instance = customer
                has_farmer = Farmer.objects.filter(email=user_instance.email).exists() or MultiAccount.objects.filter(email=user_instance.email).exists()
                has_customer = True

        if not user_instance:
            return Response({'detail': 'User not found.'}, status=404)

        return Response({
            'id': user_instance.id,
            'name': getattr(user_instance, 'name', ''),
            'email': user_instance.email,
            'has_farmer': has_farmer,
            'has_customer': has_customer
        })

@method_decorator(csrf_exempt, name='dispatch')
class SwitchAccountView(APIView):
    def post(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({'detail': 'Unauthenticated.'}, status=401)
            
        token = auth_header.split(' ')[1]
        target_role = request.data.get('role', '').strip().lower()

        if target_role not in ['farmer', 'customer']:
            return Response({'detail': 'Invalid role specified.'}, status=400)

        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except:
            return Response({'detail': 'Invalid token.'}, status=401)

        # Generate new token with updated role
        payload['role'] = target_role
        new_token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        return Response({
            'message': f'Switched to {target_role} account',
            'token': new_token,
            'role': target_role
        })