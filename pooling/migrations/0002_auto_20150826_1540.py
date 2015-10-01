# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('pooling', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='driver',
            name='description',
            field=models.TextField(verbose_name='description', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='driver',
            name='json_way',
            field=models.TextField(verbose_name='json_way'),
        ),
        migrations.AlterField(
            model_name='driver',
            name='rout_distance',
            field=models.CharField(verbose_name='rout_duration', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='driver',
            name='rout_duration',
            field=models.CharField(verbose_name='rout_duration', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='driver',
            name='rout_end_address',
            field=models.TextField(verbose_name='rout_end_address', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='driver',
            name='rout_overviewpolilyne',
            field=models.TextField(verbose_name='rout_overviewpolilyne', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='driver',
            name='rout_start_address',
            field=models.TextField(verbose_name='rout_start_address', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='driver',
            name='rout_sumary',
            field=models.TextField(verbose_name='rout_sumary', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='driver',
            name='schedule',
            field=models.CharField(verbose_name='schedule', max_length=7),
        ),
        migrations.AlterField(
            model_name='driver',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, verbose_name='Usuario_Driver', related_name='Usuario_Driver'),
        ),
        migrations.AlterField(
            model_name='leg',
            name='driver',
            field=models.ForeignKey(to='pooling.Driver', verbose_name='driver', related_name='leg'),
        ),
        migrations.AlterField(
            model_name='seeker',
            name='description',
            field=models.TextField(verbose_name='description', blank=True),
        ),
        migrations.AlterField(
            model_name='seeker',
            name='schedule',
            field=models.CharField(verbose_name='schedule', max_length=7),
        ),
        migrations.AlterField(
            model_name='seeker',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, verbose_name='Usuario Seeker', related_name='Usuario_Seeker'),
        ),
        migrations.AlterField(
            model_name='step',
            name='distance',
            field=models.CharField(verbose_name='rout_duration', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='step',
            name='duration',
            field=models.CharField(verbose_name='rout_duration', max_length=50, null=True),
        ),
        migrations.AlterField(
            model_name='step',
            name='html_instruction',
            field=models.TextField(verbose_name='html_instruction', blank=True),
        ),
        migrations.AlterField(
            model_name='step',
            name='leg',
            field=models.ForeignKey(to='pooling.Leg', verbose_name='leg', related_name='step'),
        ),
        migrations.AlterField(
            model_name='step',
            name='polyline',
            field=models.TextField(verbose_name='polyline', blank=True),
        ),
        migrations.AlterField(
            model_name='weight',
            name='driver',
            field=models.ForeignKey(to='pooling.Driver', verbose_name='driver', related_name='weight_driver'),
        ),
        migrations.AlterField(
            model_name='weight',
            name='seeker',
            field=models.ForeignKey(to='pooling.Seeker', verbose_name='seeker', related_name='weight_seeker'),
        ),
    ]
