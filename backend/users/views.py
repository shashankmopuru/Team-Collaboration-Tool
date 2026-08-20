from datetime import datetime, timezone as dt_timezone

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q
from django.utils.encoding import force_bytes, force_str
from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode,
)

from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework_simplejwt.tokens import AccessToken

from .models import UserSession

from .permissions import (
    IsAdminOrManager,
    IsAdminOnly,
)

from .serializers import (
    RegisterSerializer,
    UserProfileSerializer,
    EmployeeListSerializer,
)


# =========================================================
# REGISTER
# =========================================================

class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "message":
                    "User registered successfully."
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# LOGIN
# =========================================================

class LoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        # -------------------------------------------------
        # Validate input
        # -------------------------------------------------

        if not email or not password:

            return Response(
                {
                    "error":
                    "Email and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Find user by email
        # -------------------------------------------------

        try:

            user = User.objects.get(
                email=email
            )

        except User.DoesNotExist:

            return Response(
                {
                    "error":
                    "Invalid email or password."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # -------------------------------------------------
        # Authenticate password
        # -------------------------------------------------

        user = authenticate(
            username=user.username,
            password=password
        )

        if user is None:

            return Response(
                {
                    "error":
                    "Invalid email or password."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # -------------------------------------------------
        # Generate JWT access token
        # -------------------------------------------------

        access_token = AccessToken.for_user(user)

        # -------------------------------------------------
        # Get JWT expiry time
        # -------------------------------------------------

        expiry_timestamp = access_token["exp"]

        expiry_time = datetime.fromtimestamp(
            expiry_timestamp,
            tz=dt_timezone.utc
        )

        # -------------------------------------------------
        # Create UserSession
        # -------------------------------------------------

        session = UserSession.objects.create(
            user=user,
            token=str(access_token),
            expiry_time=expiry_time,
            is_active=True
        )

        # -------------------------------------------------
        # Return token + session + user information
        # -------------------------------------------------

        return Response(
            {
                "access": str(access_token),
                "session_id": session.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "username": user.username,
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# LOGOUT
# =========================================================

class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        # -------------------------------------------------
        # Get Authorization header
        # -------------------------------------------------

        auth_header = request.headers.get(
            "Authorization"
        )

        if not auth_header:

            return Response(
                {
                    "error":
                    "Authorization token is required."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # -------------------------------------------------
        # Extract JWT
        # Expected:
        # Authorization: Bearer <token>
        # -------------------------------------------------

        try:

            token = auth_header.split(
                " ",
                1
            )[1]

        except IndexError:

            return Response(
                {
                    "error":
                    "Invalid authorization header."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # -------------------------------------------------
        # Find active session
        # -------------------------------------------------

        try:

            session = UserSession.objects.get(
                user=request.user,
                token=token,
                is_active=True
            )

        except UserSession.DoesNotExist:

            return Response(
                {
                    "error":
                    "Active session not found."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Deactivate session
        # -------------------------------------------------

        session.is_active = False

        session.save(
            update_fields=["is_active"]
        )

        return Response(
            {
                "message":
                "Logged out successfully."
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# PROFILE
# =========================================================

class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserProfileSerializer(
            request.user
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def patch(self, request):

        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# EMPLOYEE LIST + CREATE
# =========================================================

class EmployeeListCreateView(
    ListCreateAPIView
):

    queryset = User.objects.select_related(
        "profile"
    ).all()

    def get_permissions(self):

        if self.request.method == "POST":

            return [
                IsAdminOrManager()
            ]

        return [
            IsAuthenticated()
        ]

    def get_queryset(self):

        queryset = User.objects.select_related(
            "profile"
        ).all()

        search = self.request.query_params.get(
            "search"
        )

        department = self.request.query_params.get(
            "department"
        )

        role = self.request.query_params.get(
            "role"
        )

        # -------------------------------------------------
        # Search
        # -------------------------------------------------

        if search:

            queryset = queryset.filter(
                Q(username__icontains=search)
                | Q(email__icontains=search)
                | Q(first_name__icontains=search)
                | Q(last_name__icontains=search)
            )

        # -------------------------------------------------
        # Department filter
        # -------------------------------------------------

        if department:

            queryset = queryset.filter(
                profile__department__iexact=department
            )

        # -------------------------------------------------
        # Role filter
        # -------------------------------------------------

        if role:

            queryset = queryset.filter(
                profile__role__iexact=role
            )

        return queryset

    def get_serializer_class(self):

        if self.request.method == "POST":

            return RegisterSerializer

        return EmployeeListSerializer


# =========================================================
# EMPLOYEE DETAIL
# =========================================================

class EmployeeDetailView(
    RetrieveUpdateDestroyAPIView
):

    queryset = User.objects.select_related(
        "profile"
    ).all()

    serializer_class = EmployeeListSerializer

    def get_permissions(self):

        # -------------------------------------------------
        # DELETE
        # -------------------------------------------------

        if self.request.method == "DELETE":

            return [
                IsAdminOnly()
            ]

        # -------------------------------------------------
        # UPDATE
        # -------------------------------------------------

        if self.request.method in [
            "PUT",
            "PATCH"
        ]:

            return [
                IsAdminOrManager()
            ]

        # -------------------------------------------------
        # VIEW
        # -------------------------------------------------

        return [
            IsAuthenticated()
        ]

    def perform_destroy(self, instance):

        # Soft delete
        instance.is_active = False

        instance.save(
            update_fields=["is_active"]
        )


# =========================================================
# FORGOT PASSWORD
# =========================================================

class ForgotPasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get(
            "email"
        )

        if not email:

            return Response(
                {
                    "error":
                    "Email is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            user = User.objects.get(
                email=email
            )

            # -------------------------------------------------
            # Generate password reset token
            # -------------------------------------------------

            uid = urlsafe_base64_encode(
                force_bytes(user.pk)
            )

            token = PasswordResetTokenGenerator().make_token(
                user
            )

            # -------------------------------------------------
            # Reset link
            # -------------------------------------------------

            reset_link = (
                f"http://localhost:5173/"
                f"reset-password/{uid}/{token}"
            )

            # -------------------------------------------------
            # Send email
            # -------------------------------------------------

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

                recipient_list=[
                    email
                ],

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
                {
                    "error":
                    "User not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )


# =========================================================
# RESET PASSWORD
# =========================================================

class ResetPasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        uid = request.data.get(
            "uid"
        )

        token = request.data.get(
            "token"
        )

        password = request.data.get(
            "password"
        )

        # -------------------------------------------------
        # Validate fields
        # -------------------------------------------------

        if not uid or not token or not password:

            return Response(
                {
                    "error":
                    "All fields are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Decode user
        # -------------------------------------------------

        try:

            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(
                pk=user_id
            )

        except Exception:

            return Response(
                {
                    "error":
                    "Invalid reset link."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # Validate reset token
        # -------------------------------------------------

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

        # -------------------------------------------------
        # Change password
        # -------------------------------------------------

        user.set_password(
            password
        )

        user.save()

        # -------------------------------------------------
        # Deactivate existing sessions
        # -------------------------------------------------

        UserSession.objects.filter(
            user=user,
            is_active=True
        ).update(
            is_active=False
        )

        return Response(
            {
                "message":
                "Password reset successful."
            },
            status=status.HTTP_200_OK
        )