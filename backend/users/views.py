from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.encoding import force_bytes, force_str
from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode,
)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserProfileSerializer


class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {"message": "User registered successfully."},
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:

            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        user = authenticate(
            username=user.username,
            password=password
        )

        if user is None:

            return Response(
                {"error": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK
        )


class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserProfileSerializer(request.user)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class ForgotPasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")

        if not email:

            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            user = User.objects.get(email=email)

            uid = urlsafe_base64_encode(
                force_bytes(user.pk)
            )

            token = PasswordResetTokenGenerator().make_token(user)

            reset_link = (
                f"http://localhost:5173/reset-password/{uid}/{token}"
            )

            send_mail(
                subject="Team Sync Password Reset",
                message=f"""
Hi {user.username},

We received a request to reset your password.

Click the link below:

{reset_link}

If you didn't request this, you can safely ignore this email.

Regards,
Team Sync
""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

            return Response(
                {
                    "message":
                    "Password reset link sent successfully."
                },
                status=status.HTTP_200_OK
            )

        except User.DoesNotExist:

            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class ResetPasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        uid = request.data.get("uid")
        token = request.data.get("token")
        password = request.data.get("password")

        if not uid or not token or not password:

            return Response(
                {"error": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(pk=user_id)

        except Exception:

            return Response(
                {"error": "Invalid reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not PasswordResetTokenGenerator().check_token(
            user,
            token,
        ):

            return Response(
                {
                    "error":
                    "Reset link has expired or is invalid."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.save()

        return Response(
            {"message": "Password reset successful."},
            status=status.HTTP_200_OK
        )