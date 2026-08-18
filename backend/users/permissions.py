from rest_framework.permissions import BasePermission


class IsAdminOrManager(BasePermission):
    """
    Allows access only to users with Admin or Manager role.
    """

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        try:
            role = request.user.profile.role
        except Exception:
            return False

        return role in ["admin", "manager"]


class IsAdminOnly(BasePermission):
    """
    Allows access only to Admin users.
    """

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        try:
            role = request.user.profile.role
        except Exception:
            return False

        return role == "admin"