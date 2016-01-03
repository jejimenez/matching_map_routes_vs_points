from django.shortcuts import render
from rest_framework import permissions, viewsets, status, views
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout

from social.apps.django_app.utils import psa, load_strategy
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes

from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer

from rest_framework_social_oauth2.authentication import SocialAuthentication

from rest_framework.authentication import BaseAuthentication, get_authorization_header
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


@psa('social:complete', )
def register_by_access_token(request):

    token = request.GET.get('access_token')
    # here comes the magic
    user = request.backend.do_auth(token)
    if user:
        login(request, user)
        # that function will return our own
        # OAuth2 token as JSON
        # Normally, we wouldn't necessarily return a new token, but you get the idea
        return get_access_token(user)
    else:
        # If there was an error... you decide what you do here
        return HttpResponse("error")


#@csrf_exempt
#@strategy()
#@permission_classes((permissions.AllowAny,))
@psa('social:complete')
def auth_by_token(request, backend):
    print('auth_by_token')
    backend = request.strategy.backend
    user=request.user
    print("auth_by_token-->"+str(backend))
    print("auth_by_token-->"+str(request.DATA.get('access_token')))
    print("auth_by_token-->"+str(user.is_authenticated()))
    print("auth_by_token-->"+str(user))
    user = backend.do_auth(
        access_token=request.DATA.get('access_token'),
        user=user.is_authenticated() and user or None
        )
    print("auth_by_token-->"+str(user))
    if user and user.is_active:
        return user# Return anything that makes sense here
    else:
        return None
        
        
        
@csrf_exempt
@api_view(['POST'])
@permission_classes((permissions.AllowAny,))
def social_register(request):
    auth_token = request.DATA.get('access_token', None)
    backend = request.DATA.get('backend', None)
    #user = auth_by_token(request, backend)
    #print(NAMESPACE)
    #print(reverse(NAMESPACE + ":complete", args=(backend,)))

    #auth_header = get_authorization_header(request).decode(HTTP_HEADER_ENCODING)

    #print(auth_header)
    #auth = request.META.get('HTTP_AUTHORIZATION', b'')
    #print(auth)
    
    #return Response("vamos a ver", status=300)
    print(auth_token+" - "+backend)
    if auth_token and backend:
        try:
            sa = SocialAuthentication()
            user, token = sa.authenticate(request)
            print("user: "+str(user))
            print("user: "+str(user.__dir__))
            print("token: "+token)
        except Exception as err:
            return Response(str(err), status=400)
        if user and token:
            login(request, user)
            serialized = AccountSerializer(user)
            return Response(serialized.data, status=status.HTTP_200_OK )
        else:
            return Response("Bad Credentials: ", status=403)

        '''try:
            print('try')
            user = auth_by_token(request, backend)
        except Exception as err:
            print('1. error en social_register try user = auth...')
            return Response(str(err), status=400)
        if user:
            print('2. if user...')
            strategy = load_strategy(request=request, backend=backend)
            _do_login(strategy, user)
            return Response( "User logged in", status=status.HTTP_200_OK )
        else:
            print('3. else...')
            return Response("Bad Credentials", status=403)
    else:
        print('3. else...')
        return Response("Bad request", status=400)'''