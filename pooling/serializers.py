from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from pooling.models import Seeker
from authentication.serializers import AccountSerializer


class SeekerSerializer(serializers.ModelSerializer):
	#print("serializers")
	#password = serializers.CharField(write_only=True, required=False)
	#confirm_password =serializers.CharField(write_only=True, required=False)

	user = AccountSerializer(read_only=True, required=False)

	class Meta:
		#print("meta 1")
		model = Seeker
		fields = ('id', 'user', 'start_lat', 'start_lng', 'start_point', 'end_lat', 'end_lnt', 'end_point', 'schedule', 'description')
		read_only_fields = ('id')

		def get_validation_exclusions(self, *args, **kwargs):
			exclusions = super(SeekerSerializer, self).get_validation_exclusions()
			return exclusions + ['user']

		'''
		def create(self, validated_data):
			#print("create")
			return Account.objects.create(**validated_data)

		def update(self, instance, validated_data):
			#print("update")
			instance.username = validated_data.get('username', instance.username)
			instance.tagline = validated_data.get('tagline', instance.tagline)

			instance.save()

			password = validated_data.get('password', None)
			confirm_password = validated_data.get('confirm_password', None)

			if password and confirm_password and password == confirm_password:
				instance.set_password(password)
				instance.save()
			#When a user's password is updated, their session authentication hash must be explicitly updated. If we don't do this here, the user will not be authenticated on their next request and will have to log in again.  https://thinkster.io/django-angularjs-tutorial/
			update_session_auth_hash(self.context.get('request'), instance)

			return instance'''

