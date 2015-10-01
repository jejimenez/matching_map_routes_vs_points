# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.gis.db.models.fields
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Driver',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('json_way', models.TextField(verbose_name=b'json_way')),
                ('schedule', models.CharField(max_length=7, verbose_name=b'schedule')),
                ('description', models.TextField(null=True, verbose_name=b'description', blank=True)),
                ('rout_sumary', models.TextField(null=True, verbose_name=b'rout_sumary', blank=True)),
                ('rout_duration', models.CharField(max_length=50, null=True, verbose_name=b'rout_duration')),
                ('rout_distance', models.CharField(max_length=50, null=True, verbose_name=b'rout_duration')),
                ('rout_start_lat', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('rout_start_lng', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('start_point', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('rout_end_lat', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('rout_end_lng', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('end_point', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('rout_start_address', models.TextField(null=True, verbose_name=b'rout_start_address', blank=True)),
                ('rout_end_address', models.TextField(null=True, verbose_name=b'rout_end_address', blank=True)),
                ('rout_overviewpolilyne', models.TextField(null=True, verbose_name=b'rout_overviewpolilyne', blank=True)),
                ('rout_bound_sw_lat', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('rout_bound_sw_lng', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('rout_bound_ne_lat', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('rout_bound_ne_lng', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('user', models.ForeignKey(related_name='Usuario_Driver', verbose_name=b'Usuario_Driver', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Leg',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('driver', models.ForeignKey(related_name='leg', verbose_name=b'driver', to='pooling.Driver')),
            ],
        ),
        migrations.CreateModel(
            name='Seeker',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_lat', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('start_lng', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('start_point', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('end_lat', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('end_lnt', models.DecimalField(null=True, max_digits=19, decimal_places=10, blank=True)),
                ('end_point', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('schedule', models.CharField(max_length=7, verbose_name=b'schedule')),
                ('description', models.TextField(verbose_name=b'description', blank=True)),
                ('user', models.ForeignKey(related_name='Usuario_Seeker', verbose_name=b'Usuario Seeker', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Step',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('start_lat', models.DecimalField(max_digits=19, decimal_places=10)),
                ('start_lng', models.DecimalField(max_digits=19, decimal_places=10)),
                ('start_point', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('end_lat', models.DecimalField(max_digits=19, decimal_places=10)),
                ('end_lng', models.DecimalField(max_digits=19, decimal_places=10)),
                ('end_point', django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ('polyline', models.TextField(verbose_name=b'polyline', blank=True)),
                ('duration', models.CharField(max_length=50, null=True, verbose_name=b'rout_duration')),
                ('html_instruction', models.TextField(verbose_name=b'html_instruction', blank=True)),
                ('distance', models.CharField(max_length=50, null=True, verbose_name=b'rout_duration')),
                ('leg', models.ForeignKey(related_name='step', verbose_name=b'leg', to='pooling.Leg')),
            ],
        ),
        migrations.CreateModel(
            name='Weight',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('weight', models.IntegerField()),
                ('start_distance', models.FloatField()),
                ('end_distance', models.FloatField()),
                ('driver', models.ForeignKey(related_name='weight_driver', verbose_name=b'driver', to='pooling.Driver')),
                ('seeker', models.ForeignKey(related_name='weight_seeker', verbose_name=b'seeker', to='pooling.Seeker')),
            ],
        ),
    ]
