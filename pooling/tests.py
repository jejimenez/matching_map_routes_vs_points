from rest_framework.reverse import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory
from authentication.models import Account
from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from pooling.models import Seeker
from pooling.views import SeekerViewSet
import json
from pprint import pprint
#
#from oauth2client.client import OAuth2WebServerFlow
#from oauth2client.tools import run_flow
#from oauth2client.file import Storage
#
import requests

# Create your tests here.


class SeekerTests(APITestCase):

    def setUp(self):
        self.superuser = Account.objects.create_superuser('cpooling@cpooling.com', 'cpoolingpassword', username='cpooling')
        self.data = {'email': 'jimenez.ing.sis@gmail.com', 'username': 'jjimenez', 'password': 'desarroll0', }
        self.account_data = {'email':'mail@mail.com', 'password':'pass', 'username':'mail'}
        self.account_staff = {'email':'staff@staff.com', 'password':'staff', 'username':'staff', 'is_staff':'True'}
        self.account_data2 = {'email':'mail2@mail2.com', 'password':'pass2', 'username':'mail2'}
        self.account = Account.objects.create_user(email=self.account_data.get('email'), password=self.account_data.get('password'), username=self.account_data.get('username'))
        self.account2 = Account.objects.create_user(email=self.account_data2.get('email'), password=self.account_data2.get('password'), username=self.account_data2.get('username'))
        self.staff = Account.objects.create_user(email=self.account_staff.get('email'), password=self.account_staff.get('password'), username=self.account_staff.get('username'), is_staff = True)
        self.staff.is_staff = True
        self.staff.save()
        self.seeker = {
            'start_lat' : '45654',
            'start_lng' : '45654',
            'start_point' : 'POINT(45654 45654)',
            'end_lat' : '45654',
            'end_lnt' : '45654',
            'end_point' : 'POINT(45654 45654)',
            'schedule' : '1',
            'description' : 'Descript'
        }
        self.seeker_updated = {
            'start_lat' : '45654',
            'start_lng' : '45654',
            'start_point' : 'POINT(45654 45654)',
            'end_lat' : '45654',
            'end_lnt' : '45654',
            'end_point' : 'POINT(45654 45654)',
            'schedule' : '1',
            'description' : 'Description updated'
        }

    def test_create_seeker_points(self):
        """
        Ensure we can create a new seeker points objects.
        """
        # login
        response = self.client.post(reverse('login'), self.account_data, format='json' )
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        response2 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Seeker.objects.filter(description='Descript').count(), 1)

    def test_list_seeker_points(self):
        response = self.client.post(reverse('login'), self.account_data, format='json' )
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        response1 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response2 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response3 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response3 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        #response4 = self.client.get('/api/v1/pooling/accounts/'+'jjimenez'+'/seekers/')
        response4 = self.client.get(reverse('accseeker-list', [self.account_data.get('username')]), format='json')
        self.assertEqual(len(response4.data), 4)
        response5 = self.client.get(reverse('accseeker-list', [self.data.get('username')]), format='json')
        self.assertEqual(len(response5.data), 0)


    def test_update_seeker_points(self):
        response = self.client.post(reverse('login'), self.account_data, format='json' )
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        response1 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response2 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response3 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response3 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        #response4 = self.client.get('/api/v1/pooling/accounts/'+'jjimenez'+'/seekers/')
        response4 = self.client.get(reverse('accseeker-list', [self.account_data.get('username')]), format='json') # to get one of the ids created
        response5 = self.client.put(reverse('seeker-detail', [response4.data[1]['id']]), self.seeker_updated, format='json')
        self.assertEqual(response5.status_code, status.HTTP_200_OK)
        #self.assertEqual(len(response4.data), 4)
        

    def test_delete_seeker_points(self):
        response = self.client.post(reverse('login'), self.account_data, format='json' )
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        response1 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response2 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response3 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response3 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        #response4 = self.client.get('/api/v1/pooling/accounts/'+'jjimenez'+'/seekers/')
        response4 = self.client.get(reverse('accseeker-list', [self.account_data.get('username')]), format='json') # to get one of the ids created
        response5 = self.client.delete(reverse('seeker-detail', [response4.data[1]['id']]), format='json')
        self.assertEqual(response5.status_code, status.HTTP_204_NO_CONTENT)

        
    def test_update_not_own_seeker_points(self):
        response = self.client.post(reverse('login'), self.account_data, format='json' )
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        response1 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response2 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response3 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response3 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        #response4 = self.client.get('/api/v1/pooling/accounts/'+'jjimenez'+'/seekers/')
        response4 = self.client.get(reverse('accseeker-list', [self.account_data.get('username')]), format='json') # to get one of the ids created

        response = self.client.post(reverse('logout'), format='json' )
        response = self.client.post(reverse('login'), self.account_data2, format='json' )

        response5 = self.client.put(reverse('seeker-detail', [response4.data[1]['id']]), self.seeker_updated, format='json')
        self.assertEqual(response5.status_code, status.HTTP_403_FORBIDDEN)
        #self.assertEqual(len(response4.data), 4)
        
    def test_update_seeker_points_by_admin(self):
        response = self.client.post(reverse('login'), self.account_data, format='json' )
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        response1 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response2 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response3 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        response4 = self.client.get(reverse('accseeker-list', [self.account_data.get('username')]), format='json') # to get one of the ids created

        response = self.client.post(reverse('logout'), format='json' )
        response = self.client.post(reverse('login'), self.account_staff, format='json' )

        response5 = self.client.put(reverse('seeker-detail', [response4.data[1]['id']]), self.seeker_updated, format='json')
        self.assertEqual(response5.status_code, status.HTTP_200_OK)
        #self.assertEqual(len(response4.data), 4)
        



class DriverTests(APITestCase):

    def setUp(self):
        self.superuser = Account.objects.create_superuser('cpooling@cpooling.com', 'cpoolingpassword', username='cpooling')
        self.data = {'email': 'jimenez.ing.sis@gmail.com', 'username': 'jjimenez', 'password': 'desarroll0', }
        self.account_data = {'email':'mail@mail.com', 'password':'pass', 'username':'mail'}
        self.account_staff = {'email':'staff@staff.com', 'password':'staff', 'username':'staff', 'is_staff':'True'}
        self.account_data2 = {'email':'mail2@mail2.com', 'password':'pass2', 'username':'mail2'}
        self.account = Account.objects.create_user(email=self.account_data.get('email'), password=self.account_data.get('password'), username=self.account_data.get('username'))
        self.account2 = Account.objects.create_user(email=self.account_data2.get('email'), password=self.account_data2.get('password'), username=self.account_data2.get('username'))
        self.staff = Account.objects.create_user(email=self.account_staff.get('email'), password=self.account_staff.get('password'), username=self.account_staff.get('username'), is_staff = True)
        self.staff.is_staff = True
        self.staff.save()
        self.seeker = {
            'start_lat' : '45654',
            'start_lng' : '45654',
            'start_point' : 'POINT(45654 45654)',
            'end_lat' : '45654',
            'end_lnt' : '45654',
            'end_point' : 'POINT(45654 45654)',
            'schedule' : '1',
            'description' : 'Descript'
        }
        self.seeker_updated = {
            'start_lat' : '45654',
            'start_lng' : '45654',
            'start_point' : 'POINT(45654 45654)',
            'end_lat' : '45654',
            'end_lnt' : '45654',
            'end_point' : 'POINT(45654 45654)',
            'schedule' : '1',
            'description' : 'Description updated'
        }

    def test_create_seeker_points(self):
        """
        Ensure we can create a new seeker points objects.
        """
        # login
        with open('pooling/dataset.json') as data_file:    
            data = json.load(data_file)
        #pprint(data)
        response = self.client.post(reverse('login'), self.account_data, format='json' )
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        response2 = self.client.post(reverse('seeker-list'), self.seeker, format='json' )
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Seeker.objects.filter(description='Descript').count(), 1)