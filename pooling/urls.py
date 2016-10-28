"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
#from tastypie.api import Api
#from pooling.api import SeekerResource
from django.contrib.auth.decorators import login_required 
from pooling.views import SeekerViewSet, IndexView, AccountSeekerViewSet
from pooling.serializers import SeekerSerializer
from authentication.views import AccountViewSet
from rest_framework_nested import routers

router = routers.SimpleRouter()
router.register(r'seekers', SeekerViewSet)
router.register(r'accounts', AccountViewSet)
accounts_router = routers.NestedSimpleRouter(router, r'accounts', lookup='account')
accounts_router.register(r'seekers', AccountSeekerViewSet, base_name='accseeker')


urlpatterns = [
#    url(r'^api/', include(v1_api.urls)),
    #url(r'^save/','pooling.views.save',name='save'),
    url(r'^api/v1/pooling/', include(router.urls)),
    url(r'^api/v1/pooling/', include(accounts_router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    #url('^.*$', IndexView.as_view(), name='index'),
    #url(r'^job/$',login_required(JobView.as_view()),name='job'),
]
