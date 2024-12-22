from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Role

User = get_user_model()


class RoleSerializer(serializers.ModelSerializer):
    """
    Serializer for Role model.
    """
    class Meta:
        model = Role
        fields = ['id', 'name']


class UserRegisterSerializer(serializers.ModelSerializer):
    
    password2 = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)  # Role name to be assigned

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'role']

    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['password2']:
            raise serializers.ValidationError(
                {"password": "Passwords do not match!"}
            )

        # Ensure password meets length requirements
        if len(data['password']) < 8:
            raise serializers.ValidationError(
                {"password": "Password must be at least 8 characters long!"}
            )

        # Check if the role exists
        role_name = data['role']
        role = Role.objects.filter(name=role_name).first()
        if not role:
            raise serializers.ValidationError(
                {"role": f"Role '{role_name}' does not exist!"}
            )

        return data

    def create(self, validated_data):
        # Remove extra fields not needed for User creation
        validated_data.pop('password2')
        role_name = validated_data.pop('role')
        password = validated_data.pop('password')

        # Get the role object based on the name
        role = Role.objects.filter(name=role_name).first()
        if not role:
            raise serializers.ValidationError(
                {"role": f"Role '{role_name}' does not exist!"}
            )

        # Create the user without assigning roles yet
        user = User.objects.create_user(**validated_data, password=password)

        # Assign the role to the user (Many-to-Many relationship)
        user.roles.add(role)  # Add the role to the user
        return user






class UserListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing users along with their assigned roles.
    """
    roles = RoleSerializer(many=True)  # Nested role serializer

    class Meta:
        model = User
        fields = ['id', 'username', 'email',
                  'roles', 'crud_permission_granted']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer to modify JWT token payload.
    Adds additional user information like username.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims to the token
        token['username'] = user.username
        return token

    def validate(self, attrs):
        # Standard token validation
        data = super().validate(attrs)

        # Modify response data structure to include only the token
        data.pop("refresh", None)  # Remove refresh token if not needed
        data["token"] = data.pop("access")

        # Add username to the response data
        data["username"] = self.user.username

        return data


class GrantCRUDPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'crud_permission_granted']

    def validate_crud_permission_granted(self, value):
        """
        Validate the permission flag (only true or false).
        """
        if value not in [True, False]:
            raise serializers.ValidationError(
                "Permission must be True or False.")
        return value
