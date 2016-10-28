from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from authentication.models import Account
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
#
#from oauth2client.client import OAuth2WebServerFlow
#from oauth2client.tools import run_flow
#from oauth2client.file import Storage
#
import requests

class AccountTests(APITestCase):

    def setUp(self):
        self.superuser = Account.objects.create_superuser('cpooling@cpooling.com', 'cpoolingpassword', username='cpooling')
        self.data = {'email': 'jimenez.ing.sis@gmail.com', 'username': 'jjimenez', 'password': 'desarroll0', }
        self.account_data = {'email':'mail@mail.com', 'password':'pass', 'username':'mail'}
        self.fake_account_data = {'email':'fake@mail.com', 'password':'fake', 'username':'fake'}
        self.inactive_account_data = {'email':'inactive@mail.com', 'password':'inactive', 'username':'inactive'}
        self.account = Account.objects.create_user(email=self.account_data.get('email'), password=self.account_data.get('password'), username=self.account_data.get('username'))
        self.inactive_account = Account.objects.create_user(email=self.inactive_account_data.get('email'), password=self.inactive_account_data.get('password'), username=self.inactive_account_data.get('username'), is_active=False)
        self.inactive_account.is_active = False
        self.inactive_account.save()
        #print(Account.objects.filter(username='inactive').get().is_active)
        #from https://developers.facebook.com/tools/accesstoken/
        #self.user_token = 'EAAXnnvWZCg1gBALZAWy3opQZBqLVZBpgygcDQ07fXmSEPuSpAT7dGKyiv6XdR75oVhoJA330rAEYsACKHxLoynQeAyQU0IsZABt7cjiOSkQoWZBBqS116X1EsoqcZBWZCPKKp0liv6vdLYpENmQ74ehMN0ZC3ZCT63GwO9QNna3rjV9wZDZD'
        #EAAXnnvWZCg1gBAGfYke5VA1JsPvUuvDQgbZCF8OHFOvuKqm6NVqfU1XUnBLcbM2HPVyr9CDPa5yxK0DH42wer72od7VPmaeJxEhqL2XyzS7vvjkb6X8CXNRSVfaMekBICpxLy1fKrLkVsZCCXZCjSkEgZCZBerZBOwGwP9TzCOZAvgZDZD
    

    def test_create_account(self):
        """
        Ensure we can create a new account object.
        """
        response = self.client.post(reverse('account-list'), self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.filter(username='jjimenez').count(), 1)
        self.assertEqual(Account.objects.filter(username='jjimenez').get().email, 'jimenez.ing.sis@gmail.com')
    
    def test_login_account(self):
        """
        Ensure we can login with the created account object.
        """
        response = self.client.post(reverse('login'), self.account_data, format='json' )
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        #response = self.client.post(reverse('logout'), self.account_data, format='json' )
        

    def test_login_inactive_account(self):
        """
        Ensure we can login with the created account object.
        """
        response = self.client.post(reverse('login'), self.inactive_account_data, format='json' )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data.get('message', None), 'Esta cuenta ha sido deshabilitada')

    def test_login_fake_account(self):
        """
        Ensure the error message when using invalid user or password.
        """
        response = self.client.post(reverse('login'), self.fake_account_data, format='json' )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data.get('message', None), 'Usuario/contraseña invalidas')    


        '''
    def test_fb_social_login(self):
        def get_fb_token():
            payload = {'grant_type': 'client_credentials', 'client_id': settings.SOCIAL_AUTH_FACEBOOK_KEY, 'client_secret': settings.SOCIAL_AUTH_FACEBOOK_SECRET,
           	          'redirect_uri':'https://www.facebook.com/connect/login_success.‌​html'}
            #file = requests.post('https://graph.facebook.com/oauth/access_token?', params = payload)
            file = requests.post('https://graph.facebook.com/oauth/access_token??client_id=1662044797371224&client_secret=048319852bdba3482c18cfda51ae558c&redirect_uri=http://localhost:8001/')
            #print file.text #to test what the FB api responded with    
            print('-->') #to test the TOKEN
            print(file.text) #to test the TOKEN
            print('-->') #to test the TOKEN
            result = file.text.split("=")[1]
            return result
        get_fb_token()
        response = self.client.post(reverse('social-login'), {'access_token': self.user_token, 'backend': 'facebook'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

    def test_gogle_social_login(self):
        def get_go_token():
            flow = OAuth2WebServerFlow(client_id=settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
                           client_secret=settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
                           scope='https://www.googleapis.com/auth/userinfo.profile',
                           redirect_uri='http://localhost:8001')
            storage = Storage('creds.data')
            credentials = run_flow(flow, storage)

            return credentials.access_token
        print(get_go_token())

        response = self.client.post(reverse('social-login'), {'access_token': self.user_token, 'backend': 'facebook'}, format='json')
        print('response.data')
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        '''

