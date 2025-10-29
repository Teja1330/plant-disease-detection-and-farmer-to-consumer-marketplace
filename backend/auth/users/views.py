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
# In users/views.py - ADD this import at the top
from .permissions import IsAuthenticatedWithJWT, IsFarmerOrMultiAccount



JWT_SECRET = settings.SECRET_KEY
JWT_ALGORITHM = 'HS256'


# In users/views.py - UPDATE create_multiaccount function
def create_multiaccount_and_cleanup(email, password, farmer, customer):
    """Create MultiAccount and clean up individual entries"""
    try:
        print(f"🔄 Creating MultiAccount and cleaning up for: {email}")
        
        # Create MultiAccount
        multi_account = MultiAccount.objects.create(
            email=email,
            password=password,
            farmer=farmer,
            customer=customer
        )
        multi_account.set_password(password)
        multi_account.save()
        
        print(f"✅ MultiAccount created - ID: {multi_account.id}")
        
        # Delete individual entries since they're now in MultiAccount
        # But wait - we can't delete them because of OneToOne relationships
        # Instead, we'll keep them but they'll only be accessible via MultiAccount
        
        print(f"✅ Individual accounts linked to MultiAccount - Farmer ID: {farmer.id}, Customer ID: {customer.id}")
        
        return multi_account
        
    except Exception as e:
        print(f"❌ Error creating MultiAccount: {e}")
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
            phone = request.data.get('phone', '').strip()
            address = request.data.get('address', '').strip()
            pincode = request.data.get('pincode', '').strip()

            # Basic validations
            if not all([email, password, name, role]):
                return Response({'detail': 'Email, password, name and role are required.'}, status=400)

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
            user_data = {
                'email': email, 
                'name': name, 
                'password': password,
                'phone': phone,
                'street_address': request.data.get('street_address', '').strip(),
                'city': request.data.get('city', '').strip(),
                'district': request.data.get('district', '').strip(),
                'state': request.data.get('state', '').strip(),
                'country': request.data.get('country', 'India').strip(),
                'pincode': request.data.get('pincode', '').strip()
            }
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
                    'has_customer': has_customer or MultiAccount.objects.filter(email=email).exists(),
                    'phone': getattr(user_instance, 'phone', phone),
                    'street_address': getattr(user_instance, 'street_address', ''),
                    'city': getattr(user_instance, 'city', ''),
                    'district': getattr(user_instance, 'district', ''),
                    'state': getattr(user_instance, 'state', ''),
                    'country': getattr(user_instance, 'country', 'India'),
                    'pincode': getattr(user_instance, 'pincode', '')
                }
            })
                
        except Exception as e:
            return Response({'detail': f'Registration failed: {str(e)}'}, status=400)


# In users/views.py - UPDATE LoginView to ensure correct IDs
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email', '').strip().lower()
            password = request.data.get('password', '')

            if not email or not password:
                return Response({'detail': 'Email and password required.'}, status=400)

            print(f"🔐 Login attempt for email: {email}")

            user_instance = None
            role = None
            has_farmer = False
            has_customer = False
            user_id = None
            user_name = None

            # Check MultiAccount first
            multi_account = MultiAccount.objects.filter(email=email).first()
            if multi_account and multi_account.check_password(password):
                user_instance = multi_account
                user_id = multi_account.id
                user_name = multi_account.farmer.name
                has_farmer = True
                has_customer = True
                role = 'multi'
                print(f"✅ MultiAccount login successful: {email}, ID: {user_id}")
            else:
                # Check individual tables
                farmer = Farmer.objects.filter(email=email).first()
                customer = Customer.objects.filter(email=email).first()
                
                print(f"🔍 Checking farmer: {farmer is not None}, customer: {customer is not None}")
                
                # Check farmer with password
                if farmer and farmer.check_password(password):
                    user_instance = farmer
                    user_id = farmer.id
                    user_name = farmer.name
                    role = 'farmer'
                    has_farmer = True
                    # Check if this email also has customer account
                    has_customer = Customer.objects.filter(email=email).exists() or MultiAccount.objects.filter(email=email).exists()
                    print(f"✅ Farmer login successful: {email}, ID: {user_id}")
                
                # Check customer with password (only if farmer check failed)
                elif customer and customer.check_password(password):
                    user_instance = customer
                    user_id = customer.id
                    user_name = customer.name
                    role = 'customer'
                    has_customer = True
                    # Check if this email also has farmer account
                    has_farmer = Farmer.objects.filter(email=email).exists() or MultiAccount.objects.filter(email=email).exists()
                    print(f"✅ Customer login successful: {email}, ID: {user_id}")
                else:
                    print("❌ Invalid credentials for both farmer and customer")
                    return Response({'detail': 'Invalid credentials.'}, status=400)

            if not user_instance:
                print("❌ No user instance found")
                return Response({'detail': 'Invalid credentials.'}, status=400)

            # Generate token - Use the CORRECT user ID we found
            payload = {
                'id': user_id,  # This is now the correct ID from the database
                'email': email,
                'role': role,
                'has_farmer': has_farmer,
                'has_customer': has_customer,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
                'iat': datetime.datetime.utcnow(),
            }
            token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

            print(f"🎯 Login successful - User ID: {user_id}, Name: {user_name}, Role: {role}")

            # Return user data based on actual user type
            user_data = {
                'id': user_instance.id,  # This will be F1, C1, M1, etc.
                'name': user_name,
                'email': email,
                'role': role,
                'has_farmer': has_farmer,
                'has_customer': has_customer,
                'phone': getattr(user_instance, 'phone', ''),
                'street_address': getattr(user_instance, 'street_address', ''),
                'city': getattr(user_instance, 'city', ''),
                'district': getattr(user_instance, 'district', ''),
                'state': getattr(user_instance, 'state', ''),
                'country': getattr(user_instance, 'country', 'India'),
                'pincode': getattr(user_instance, 'pincode', '')
            }

            return Response({
                'message': 'Login successful',
                'token': token,
                'user': user_data
            })
            
        except Exception as e:
            print(f"❌ Login failed: {str(e)}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
            return Response({'detail': f'Login failed: {str(e)}'}, status=400)


# In users/views.py - UPDATE UserView to handle MultiAccount switching
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

        print(f"🔍 UserView - JWT Payload: {payload}")

        user_id = payload['id']
        user_email = payload['email']
        user_role = payload.get('role', '')
        user_instance = None
        
        print(f"🔍 UserView - Looking for user ID: {user_id}, Email: {user_email}, Role: {user_role}")
        
        # NEW: Handle MultiAccount users with role switching
        if user_role == 'multi':
            user_instance = MultiAccount.objects.filter(id=user_id).first()
            if user_instance:
                # For multi role, we can return either farmer or customer data
                # Let's return farmer data as default
                user_instance = user_instance.farmer
                print(f"✅ UserView - MultiAccount user, using farmer data: {user_instance.email}")
        elif user_role == 'farmer':
            user_instance = Farmer.objects.filter(id=user_id).first()
            if not user_instance:
                # Check if it's a MultiAccount user
                multi_user = MultiAccount.objects.filter(id=user_id).first()
                if multi_user:
                    user_instance = multi_user.farmer
                    print(f"✅ UserView - MultiAccount user as farmer: {user_instance.email}")
        elif user_role == 'customer':
            user_instance = Customer.objects.filter(id=user_id).first()
            if not user_instance:
                # Check if it's a MultiAccount user
                multi_user = MultiAccount.objects.filter(id=user_id).first()
                if multi_user:
                    user_instance = multi_user.customer
                    print(f"✅ UserView - MultiAccount user as customer: {user_instance.email}")

        if not user_instance:
            print(f"❌ UserView - User not found with ID: {user_id}")
            return Response({'detail': 'User not found.'}, status=404)

        # Get account status
        has_farmer = Farmer.objects.filter(email=user_instance.email).exists() or MultiAccount.objects.filter(email=user_instance.email).exists()
        has_customer = Customer.objects.filter(email=user_instance.email).exists() or MultiAccount.objects.filter(email=user_instance.email).exists()
        
        print(f"✅ UserView - Found user: {user_instance.email}, Role: {user_role}")

        # Return user data
        return Response({
            'id': user_instance.id,
            'name': getattr(user_instance, 'name', ''),
            'email': user_instance.email,
            'role': user_role,
            'has_farmer': has_farmer,
            'has_customer': has_customer,
            'phone': getattr(user_instance, 'phone', ''),
            'street_address': getattr(user_instance, 'street_address', ''),
            'city': getattr(user_instance, 'city', ''),
            'district': getattr(user_instance, 'district', ''),
            'state': getattr(user_instance, 'state', ''),
            'country': getattr(user_instance, 'country', 'India'),
            'pincode': getattr(user_instance, 'pincode', '')
        })


# In users/views.py - UPDATE SwitchAccountView
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

        # Get the original user to check permissions
        user_id = payload['id']
        user_email = payload['email']
        
        print(f"🔍 Switch account - User ID: {user_id}, Email: {user_email}, Target: {target_role}")
        print(f"🔍 Current payload - has_farmer: {payload.get('has_farmer')}, has_customer: {payload.get('has_customer')}")
        
        # Check if user exists and has permission to switch to this role
        has_farmer = False
        has_customer = False
        new_user_id = user_id  # Default to same ID
        
        # Check MultiAccount
        multi_account = MultiAccount.objects.filter(id=user_id).first()
        if multi_account:
            has_farmer = True
            has_customer = True
            # For MultiAccount users, we need to get the actual Farmer/Customer ID
            if target_role == 'farmer':
                new_user_id = multi_account.farmer.id  # This will be F1, F2, etc.
            else:  # customer
                new_user_id = multi_account.customer.id  # This will be C1, C2, etc.
            print(f"✅ User is MultiAccount - switching to {target_role} with ID: {new_user_id}")
        else:
            # Check individual tables
            farmer = Farmer.objects.filter(id=user_id).first()
            customer = Customer.objects.filter(id=user_id).first()
            
            if farmer:
                has_farmer = True
                has_customer = Customer.objects.filter(email=user_email).exists()
                print(f"✅ User is Farmer - has_farmer: {has_farmer}, has_customer: {has_customer}")
            elif customer:
                has_farmer = Farmer.objects.filter(email=user_email).exists()
                has_customer = True
                print(f"✅ User is Customer - has_farmer: {has_farmer}, has_customer: {has_customer}")

        # Check permissions
        if target_role == 'farmer' and not has_farmer:
            print("❌ User doesn't have farmer account")
            return Response({'detail': 'You do not have a farmer account.'}, status=403)
        if target_role == 'customer' and not has_customer:
            print("❌ User doesn't have customer account")
            return Response({'detail': 'You do not have a customer account.'}, status=403)

        print(f"✅ Permission granted to switch to {target_role}")

        # Create new payload with updated role and CORRECT user ID
        new_payload = {
            'id': new_user_id,  # Use the correct ID for the target role
            'email': payload['email'],
            'role': target_role,
            'has_farmer': has_farmer,
            'has_customer': has_customer,
            'exp': payload['exp'],
            'iat': payload['iat']
        }
        
        new_token = jwt.encode(new_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        return Response({
            'message': f'Switched to {target_role} account',
            'token': new_token,
            'role': target_role,
            'has_farmer': has_farmer,
            'has_customer': has_customer
        })


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    def post(self, request):
        try:
            return Response({
                'message': 'Logged out successfully'
            })
        except Exception as e:
            return Response({'detail': f'Logout failed: {str(e)}'}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class AvailableDistrictsView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to access this
    
    def get(self, request):
        try:
            # Get unique districts from farmers who have set their district
            districts = Farmer.objects.filter(
                district__isnull=False
            ).exclude(
                district=''
            ).values_list('district', flat=True).distinct()
            
            return Response({
                'districts': list(districts)
            })
            
        except Exception as e:
            return Response({'detail': f'Failed to fetch districts: {str(e)}'}, status=400)


# users/views.py - Add this if missing
@method_decorator(csrf_exempt, name='dispatch')
class UpdateAddressView(APIView):
    def patch(self, request):
        try:
            user_id = request.user.id
            user_email = request.user.email
            
            # Get address data from request
            street_address = request.data.get('street_address', '').strip()
            city = request.data.get('city', '').strip()
            district = request.data.get('district', '').strip()
            state = request.data.get('state', '').strip()
            country = request.data.get('country', 'India').strip()
            pincode = request.data.get('pincode', '').strip()

            # Validate required fields
            if not all([street_address, city, district, state, pincode]):
                return Response({'detail': 'All address fields are required.'}, status=400)

            # Find user and update address
            user_instance = None
            
            # Check MultiAccount
            multi_account = MultiAccount.objects.filter(id=user_id).first()
            if multi_account:
                # Update both farmer and customer addresses
                multi_account.farmer.street_address = street_address
                multi_account.farmer.city = city
                multi_account.farmer.district = district
                multi_account.farmer.state = state
                multi_account.farmer.country = country
                multi_account.farmer.pincode = pincode
                
                multi_account.customer.street_address = street_address
                multi_account.customer.city = city
                multi_account.customer.district = district
                multi_account.customer.state = state
                multi_account.customer.country = country
                multi_account.customer.pincode = pincode
                
                multi_account.farmer.save()
                multi_account.customer.save()
                user_instance = multi_account
                
            else:
                # Check individual tables
                farmer = Farmer.objects.filter(id=user_id).first()
                customer = Customer.objects.filter(id=user_id).first()
                
                if farmer:
                    farmer.street_address = street_address
                    farmer.city = city
                    farmer.district = district
                    farmer.state = state
                    farmer.country = country
                    farmer.pincode = pincode
                    farmer.save()
                    user_instance = farmer
                    
                elif customer:
                    customer.street_address = street_address
                    customer.city = city
                    customer.district = district
                    customer.state = state
                    customer.country = country
                    customer.pincode = pincode
                    customer.save()
                    user_instance = customer

            if not user_instance:
                return Response({'detail': 'User not found.'}, status=404)

            return Response({
                'message': 'Address updated successfully',
                'address': {
                    'street_address': street_address,
                    'city': city,
                    'district': district,
                    'state': state,
                    'country': country,
                    'pincode': pincode
                }
            })
            
        except Exception as e:
            return Response({'detail': f'Failed to update address: {str(e)}'}, status=400)


# In users/views.py - ADD this new view
@method_decorator(csrf_exempt, name='dispatch')
class AutoRegisterView(APIView):
    permission_classes = [IsAuthenticatedWithJWT]
    
    def post(self, request):
        """Auto-register for opposite account type and create MultiAccount"""
        try:
            current_user = request.user
            target_role = request.data.get('role', '').strip().lower()
            
            if target_role not in ['farmer', 'customer']:
                return Response({'detail': 'Invalid role specified.'}, status=400)
            
            print(f"🔄 Auto-registering {current_user.email} as {target_role}")
            
            email = current_user.email
            
            # Check if user already has both accounts (MultiAccount)
            existing_multi = MultiAccount.objects.filter(email=email).first()
            if existing_multi:
                return Response({'detail': 'You already have both farmer and customer accounts.'}, status=400)
            
            # Check if user already has the target role
            if target_role == 'farmer':
                existing_farmer = Farmer.objects.filter(email=email).first()
                if existing_farmer:
                    return Response({'detail': 'You already have a farmer account.'}, status=400)
            else:
                existing_customer = Customer.objects.filter(email=email).first()
                if existing_customer:
                    return Response({'detail': 'You already have a customer account.'}, status=400)
            
            # Get user data from current account
            name = getattr(current_user, 'name', '')
            phone = getattr(current_user, 'phone', '')
            
            # Get the password from the request or use a temporary one
            password = request.data.get('password')
            if not password:
                # Try to get from current user or use default
                if hasattr(current_user, 'check_password'):
                    # We can't get the actual password, so we'll need the frontend to provide it
                    return Response({'detail': 'Password required for auto-registration.'}, status=400)
                else:
                    password = "TempPassword123!"
            
            # Create the new account
            user_data = {
                'email': email,
                'name': name,
                'password': password,
                'phone': phone,
                'street_address': getattr(current_user, 'street_address', ''),
                'city': getattr(current_user, 'city', ''),
                'district': getattr(current_user, 'district', ''),
                'state': getattr(current_user, 'state', ''),
                'country': getattr(current_user, 'country', 'India'),
                'pincode': getattr(current_user, 'pincode', '')
            }
            
            new_account = None
            existing_account = None
            
            if target_role == 'farmer':
                # User is currently customer, creating farmer
                serializer = FarmerSerializer(data=user_data)
                if serializer.is_valid():
                    new_account = serializer.save()
                    existing_account = Customer.objects.filter(email=email).first()
                    print(f"✅ Created farmer account: {new_account.email}")
                else:
                    return Response(serializer.errors, status=400)
            else:  # customer
                # User is currently farmer, creating customer  
                serializer = CustomerSerializer(data=user_data)
                if serializer.is_valid():
                    new_account = serializer.save()
                    existing_account = Farmer.objects.filter(email=email).first()
                    print(f"✅ Created customer account: {new_account.email}")
                else:
                    return Response(serializer.errors, status=400)
            
            # Create MultiAccount with both accounts
            if new_account and existing_account:
                if target_role == 'farmer':
                    multi_account = create_multiaccount_and_cleanup(
                        email, password, new_account, existing_account
                    )
                else:
                    multi_account = create_multiaccount_and_cleanup(
                        email, password, existing_account, new_account  
                    )
                
                if multi_account:
                    # Generate new token for MultiAccount
                    payload = {
                        'id': multi_account.id,
                        'email': multi_account.email,
                        'role': 'multi',
                        'has_farmer': True,
                        'has_customer': True,
                        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24),
                        'iat': datetime.datetime.utcnow(),
                    }
                    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
                    
                    user_data = {
                        'id': multi_account.id,
                        'name': name,
                        'email': email,
                        'role': 'multi',
                        'has_farmer': True,
                        'has_customer': True,
                        'phone': phone,
                        'street_address': getattr(current_user, 'street_address', ''),
                        'city': getattr(current_user, 'city', ''),
                        'district': getattr(current_user, 'district', ''),
                        'state': getattr(current_user, 'state', ''),
                        'country': getattr(current_user, 'country', 'India'),
                        'pincode': getattr(current_user, 'pincode', '')
                    }
                    
                    return Response({
                        'message': f'Successfully registered as {target_role} and created MultiAccount!',
                        'token': token,
                        'user': user_data
                    })
            
            return Response({'detail': 'Failed to create MultiAccount.'}, status=400)
            
        except Exception as e:
            print(f"❌ Auto-registration failed: {str(e)}")
            import traceback
            print(f"❌ Traceback: {traceback.format_exc()}")
            return Response({'detail': f'Auto-registration failed: {str(e)}'}, status=400)