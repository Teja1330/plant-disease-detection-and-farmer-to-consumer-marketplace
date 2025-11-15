# In users/urls.py
from django.urls import path
from .views import (
    RegisterView, LoginView, UserView, LogoutView, 
    SwitchAccountView, AvailableDistrictsView, UpdateAddressView,
    AutoRegisterView
)

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('user', UserView.as_view(), name='user-detail'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('switch-account/', SwitchAccountView.as_view(), name='switch-account'),
    path('available-districts/', AvailableDistrictsView.as_view(), name='available-districts'),
    path('update-address/', UpdateAddressView.as_view(), name='update-address'),
    path('auto-register/', AutoRegisterView.as_view(), name='auto-register'),
]
