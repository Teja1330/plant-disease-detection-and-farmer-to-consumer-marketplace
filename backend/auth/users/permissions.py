# users/permissions.py - CREATE this file if it doesn't exist
from rest_framework import permissions

class IsAuthenticatedWithJWT(permissions.BasePermission):
    """
    Allow access to any authenticated user (farmer or customer)
    """
    def has_permission(self, request, view):
        return request.user and hasattr(request.user, 'id')

class IsFarmerOrMultiAccount(permissions.BasePermission):
    """
    Allow access only to farmers or multi-account users with farmer role.
    """
    def has_permission(self, request, view):
        # Check if user is authenticated via our JWT system
        if not request.user or not hasattr(request.user, 'id'):
            return False
        
        # Check if user has farmer permissions based on JWT payload
        return getattr(request.user, 'has_farmer', False) or getattr(request.user, 'role', '') == 'farmer'

