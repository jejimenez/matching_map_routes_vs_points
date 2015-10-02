from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from pooling.serializers import SeekerSerializer
from pooling.models import Seeker
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from authentication.permissions import IsAccountOwner
import json

# Create your views here.
class SeekerViewSet(viewsets.ModelViewSet):
    queryset = Seeker.objects.all()
    serializer_class = SeekerSerializer

    def get_permissions(self):
        #if self.request.method in permissions.SAFE_METHODS:
        #    return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(),)
    
    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        return super(SeekerViewSet, self).perform_create(serializer)


class AccountSeekerViewSet(viewsets.ViewSet):
    queryset = Seeker.objects.select_related('user').all()
    serializer_class = SeekerSerializer
    
    def list(self, request, account_username=None):
        queryset = self.queryset.filter(user__username=account_username)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def get_permissions(self):
        return (permissions.IsAuthenticated(),IsAccountOwner(),)


class IndexView(TemplateView):
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IndexView, self).dispatch(*args, **kwargs)
