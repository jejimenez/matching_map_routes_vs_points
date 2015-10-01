from django.contrib import admin
from .models import Seeker, Driver, Weight, Leg, Step

# Register your models here.

admin.site.register(Seeker)
admin.site.register(Driver)
admin.site.register(Weight)
admin.site.register(Leg)
admin.site.register(Step)

