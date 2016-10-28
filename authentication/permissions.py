from rest_framework import permissions

class IsAccountOwner (permissions.BasePermission):
    def has_object_permission(self, request, view, account):
        if request.user:
            return account == request.user
        return False


class IsSeekerOwner (permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user:
            return obj.user == request.user
        return 

class IsSeekerWriter (permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user:
            return obj.user == request.user or request.user.is_staff
        return False