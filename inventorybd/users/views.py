from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import permissions
from stores.permissions import IsStoreManagerOrReadOnly
from .serializers import UserAccountSerilizers, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework.renderers import JSONRenderer

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    renderer_classes = [JSONRenderer]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            token = serializer.validated_data
            return Response(token, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class Register(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = self.request.data

        username = data["username"]
        email = data["email"]
        password = data["password"]
        password2 = data["password2"]

        if password == password2:
            if User.objects.filter(username=username).exists():
                return Response({"error": "user already exsits!"})
            else:
                if len(password) < 8:
                    return Response({"error": "Password minimum 8 charectors require!"})
                else:
                    user = User.objects.create_user(
                        username=username, password=password, email=email
                    )
                    user.is_department_manager = True
                    user.save()
                    return Response({"success": "User created successfully!"})

        else:
            return Response({"error": "Password do not match!"})


class UserListView(APIView):
    permission_classes = [IsStoreManagerOrReadOnly]

    def get(self, request):
        user = User.objects.all()
        serializer = UserAccountSerilizers(user, many=True)
        return Response(serializer.data)


class UserDetailView(APIView):
    permission_classes = [IsStoreManagerOrReadOnly]

    def get(self, request, pk):
        user = User.objects.get(id=pk)
        serializer = UserAccountSerilizers(user)
        return Response(serializer.data)


class UserApprovalView(APIView):
    permission_classes = [IsStoreManagerOrReadOnly]
    
    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except user.DoesNotExist:
            return Response(
                {"message": "User does not exist"},
                status=status.HTTP_404_NOT_FOUND,
            )
        user.is_store_manager = True
        user.is_staff = True
        user.save()
        return Response(
            {"message": "User approved successfully"},
            status=status.HTTP_200_OK,
        )
