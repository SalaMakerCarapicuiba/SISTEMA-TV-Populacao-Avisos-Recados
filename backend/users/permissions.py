# Permissions User
from rest_framework.permissions import BasePermission
from users.models import User

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == User.ADMIN

