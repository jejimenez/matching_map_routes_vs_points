from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from pooling.serializers import SeekerSerializer
from pooling.models import Seeker
from rest_framework import viewsets, permissions
import json

# Create your views here.
class SeekerViewSet(viewsets.ModelViewSet):
    queryset = Seeker.objects.all()
    serializer_class = SeekerSerializer
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(),)
    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        return super(SeekerViewSet, self).perform_create(serializer)

class IndexView(TemplateView):
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IndexView, self).dispatch(*args, **kwargs)
