from rest_framework.permissions import BasePermission


class IsStoreManager(BasePermission):
    """
    Allows access only to users with the 'Store Manager' role.
    """

    def has_permission(self, request, view):
        # Check if user is authenticated and has the 'Store Manager' role
        return (
            request.user
            and request.user.is_authenticated
            and request.user.roles.filter(name="Store Manager").exists()
        )


class IsDepartmentManager(BasePermission):
    """
    Allows access only to users with the 'Department Manager' role.
    """

    def has_permission(self, request, view):
        # Check if user is authenticated and has the 'Department Manager' role
        return (
            request.user
            and request.user.is_authenticated
            and request.user.roles.filter(name="Department Manager").exists()
        )
