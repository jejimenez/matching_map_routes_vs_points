from tastypie.resources import ModelResource
#from tastypie.contrib.gis.resources import ModelResource
from .models import Seeker
from tastypie.authentication import Authentication
from tastypie.authorization import Authorization
from tastypie.fields import IntegerField

class SeekerResource(ModelResource):
    """
    API Facet
    """
    #user_id = IntegerField(attribute="user_id")
    class Meta:
        queryset = Seeker.objects.all()
        resource_name = 'seeker'
        #allowed_methods = ['post', 'get', 'patch', 'delete']
        #authentication = Authentication()
        authorization = Authorization()
        always_return_data = True
        '''filtering = {
            'polys': ALL,
        }'''

