from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.renderers import JSONRenderer
from stores.permissions import IsDepartmentManager, IsStoreManager
from .serializers import (
    RoleSerializer,
    UserRegisterSerializer,
    UserListSerializer,
    CustomTokenObtainPairSerializer,
    GrantCRUDPermissionSerializer
)

from .models import Role

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT token view.
    """
    serializer_class = CustomTokenObtainPairSerializer
    renderer_classes = [JSONRenderer]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data
            return Response(token, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateRoleView(APIView):
    permission_classes = [IsAuthenticated]

    @method_decorator(csrf_protect)
    def post(self, request):
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": "Role created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoleListView(APIView):
    # Allow only admin users to create
    permission_classes = [IsStoreManager]

    def get(self, request):
        """
        List all roles.
        Accessible by authenticated users.
        """
        roles = Role.objects.all()
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)


class Register(APIView):
    """
    User registration view. Assigns roles and validates data.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": "User created successfully!"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    """
    View to list all users. Accessible by Store Managers and Departmant Manager.
    """
    permission_classes = [IsStoreManager | IsDepartmentManager]

    def get(self, request):
        users = User.objects.all()
        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserDetailView(APIView):
    """
    View to retrieve user details by ID.
    """
    permission_classes = [IsStoreManager]

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {"error": "User does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = UserListSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserApprovalView(APIView):
    """
    View for approving a user. Accessible by Store Managers.
    """

    permission_classes = [IsStoreManager]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response(
                {"error": "User does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Approve user as Store Manager
        store_manager_role = Role.objects.filter(name="Store Manager").first()
        if not store_manager_role:
            return Response(
                {"error": "Role 'Store Manager' does not exist!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.roles.add(store_manager_role)
        user.is_staff = True
        user.save()
        return Response(
            {"success": "User approved as Store Manager successfully!"},
            status=status.HTTP_200_OK
        )

    
class UserUpdateView(APIView):
    
    permission_classes = [IsStoreManager]
    
    def put(self, request, pk):
            try:
                user = User.objects.get(pk=pk)
            except User.DoesNotExist:
                return Response(
                    {"error": "User does not exist"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Check if the Department Manager role exists, if not create it
            department_manager_role = Role.objects.filter(name="Department Manager").first()
            if not department_manager_role:
                department_manager_role = Role.objects.create(name="Department Manager")

            user.roles.add(department_manager_role)
            user.is_staff = True
            user.save()
            return Response(
                {"success": "User approved successfully!"},
                status=status.HTTP_200_OK
            )


class UserDeleteView(APIView):

    permission_classes = [IsStoreManager]

    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # You can check for any permissions or roles here if needed
        user.delete()
        return Response({"success": "User deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)

  
class GrantCRUDPermissionAPIView(APIView):

    permission_classes = [IsAuthenticated, IsStoreManager]

    """
    Handle the approval of CRUD permissions for Department Managers.
    """

    def post(self, request, department_manager_id=None):
        """
        Handle the POST request to grant CRUD permission to the Department Manager.
        """
        try:
            # Find the department manager by their ID and ensure they have the correct role
            department_manager = User.objects.filter(
                id=department_manager_id and Q(roles__name='Department Manager') | Q(roles__name='Store Manager')).first()

            if not department_manager:
                return Response({"detail": "Department Manager not found or does not have the required role."}, status=status.HTTP_404_NOT_FOUND)

            # Initialize the serializer with the data
            serializer = GrantCRUDPermissionSerializer(
                department_manager, data=request.data, partial=True)

            if serializer.is_valid():
                # Grant the CRUD permission
                department_manager.crud_permission_granted = serializer.validated_data[
                    'crud_permission_granted']
                
                department_manager.save()

                return Response({"detail": "CRUD permission granted successfully."}, status=status.HTTP_200_OK)
            else:
                # Log the errors if validation fails
                return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserCountView(APIView):
    permission_classes = [IsStoreManager | IsDepartmentManager]

    def get(self, request):
        users_count = User.objects.all().count()
        return Response({"count_users": users_count})



class LogoutView(APIView):
    permission_classes = permission_classes = [
        IsStoreManager | IsDepartmentManager]

    def post(self, request):
        # Optional: Add token to a blacklist if you're using a token blacklist system
        # For now, this just removes the token on the client side

        response = Response({"message": "Logout successful."}, status=200)

        # Delete the access_token and refresh_token cookies if they're set
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')

        return response
