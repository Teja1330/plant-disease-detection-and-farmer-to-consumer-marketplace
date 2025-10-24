# users/permissions.py
from rest_framework import permissions

class IsFarmerOrMultiAccount(permissions.BasePermission):
    """
    Allow access only to farmers or multi-account users with farmer role.
    """
    def has_permission(self, request, view):
        # Check if user is authenticated via our JWT system
        if not request.user or not hasattr(request.user, 'has_farmer'):
            return False
        
        # Allow if user has farmer account
        return request.user.has_farmer

class IsAuthenticatedWithJWT(permissions.BasePermission):
    """
    Allow access to any authenticated user (farmer or customer)
    """
    def has_permission(self, request, view):
        return request.user and hasattr(request.user, 'id')