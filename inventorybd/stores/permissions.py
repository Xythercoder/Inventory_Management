from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication


class IsStoreManagerOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True

        jwt_authentication = JWTAuthentication()
        user, _ = jwt_authentication.authenticate(request)
        return user and user.is_authenticated and user.is_store_manager


class IsDepartmentManagerOrStoreManagerOrReadOnly(permissions.BasePermission):
    
    def has_permission(self, request, view):
        
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        jwt_authentication = JWTAuthentication()
        user, _ = jwt_authentication.authenticate(request)
        return user and user.is_authenticated and user.is_store_manager
        
