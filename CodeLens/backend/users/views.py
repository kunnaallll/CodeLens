from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("username", "email", "password", "first_name", "last_name")

    def validate_password(self, value):
        user = User(
            username=self.initial_data.get("username", ""),
            email=self.initial_data.get("email", ""),
        )
        try:
            validate_password(value, user=user)
        except DjangoValidationError as error:
            raise serializers.ValidationError(error.messages) from error
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)


class CodeLensTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["role"] = "admin" if user.is_staff else "student"
        return token


class LoginView(TokenObtainPairView):
    serializer_class = CodeLensTokenSerializer
    permission_classes = (AllowAny,)


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": "admin" if user.is_staff else "student",
        })
