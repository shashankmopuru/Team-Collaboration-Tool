from django.urls import path
from .views import RegisterView, LoginView, ProfileView, ForgotPasswordView, ResetPasswordView, EmployeeListCreateView, EmployeeDetailView
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path(
    'forgot-password/',
    ForgotPasswordView.as_view(),
    name='forgot-password',
),
    path(
    "reset-password/",
    ResetPasswordView.as_view(),
    name="reset-password",
),
    path(
    "employees/",
    EmployeeListCreateView.as_view(),
    name="employees"
),

    path(
    "employees/<int:pk>/",
    EmployeeDetailView.as_view(),
    name="employee-detail"
),
]
