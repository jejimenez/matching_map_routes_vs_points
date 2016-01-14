from django.shortcuts import render
from rest_framework import permissions, viewsets, status, views
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes

from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer

from rest_framework_social_oauth2.authentication import SocialAuthentication

from rest_framework.authentication import BaseAuthentication, get_authorization_header
from social.apps.django_app.utils import load_backend, load_strategy
from social.exceptions import MissingBackend
from rest_framework import exceptions, HTTP_HEADER_ENCODING
from social.apps.django_app.views import NAMESPACE
from django.core.urlresolvers import reverse

import json

# Create your views here.

class AccountViewSet(viewsets.ModelViewSet):
    # we will use the username attribute of the Account model to look up accounts instead of the id attribute. Overriding lookup_field handles this for us  : https://thinkster.io/django-angularjs-tutorial/
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)


    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)
        return Response(serializer.validated_data, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    def post(self, request, format=None):
        data = json.loads((request.body).decode('utf-8')) #json.loads(request.body)
        email = data.get('email', None)
        password = data.get('password', None)
        account = authenticate(email=email, password=password)
        if account is not None:
            if account.is_active:
                login(request, account)
                serialized = AccountSerializer(account)
                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'Esta cuenta ha sido deshabilitada.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Usuario/contraseña invalidas'
            }, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def social_login(request):
    """
    Returns two-tuple of (user, token) if authentication succeeds,
    or None otherwise.
    """
    token = request.DATA.get('access_token', None)
    backend = request.DATA.get('backend', None)
    strategy = load_strategy(request=request)
    try:
        backend = load_backend(strategy, backend, reverse(NAMESPACE + ":complete", args=(backend,)))
    except MissingBackend:
        msg = 'Invalid token header. Invalid backend.'
        return Response(str(msg), status=400)
    try:
        user = backend.do_auth(access_token=token)
    except requests.HTTPError as e:
        msg = e.response.text
        return Response(str(msg), status=400)
    if not user:
        msg = 'Bad credentials.'
        return Response(str(msg), status=400)

    login(request, user)
    serialized = AccountSerializer(user)
    return Response(serialized.data, status=status.HTTP_200_OK )
