from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


class UserAccountSerilizers(serializers.ModelSerializer):

    class Meta:

        model = User
        fields = ["id", "email", "is_staff", "is_store_manager"]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        if isinstance(token, AccessToken):
            # Customize payload for access token
            token.payload = {"token": str(token.access_token)}
            token.payload = {
                "token": str(token.access_token),
                "username": user.username,  
                "password": user.password, 
            }

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data.pop("refresh", None)
        data["token"] = data.pop("access")
        return data
