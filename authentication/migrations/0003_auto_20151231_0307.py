# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0006_require_contenttypes_0002'),
        ('authentication', '0002_account_is_staff'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='groups',
            field=models.ManyToManyField(verbose_name='groups', blank=True, to='auth.Group', related_query_name='user', related_name='user_set', help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
        ),
        migrations.AddField(
            model_name='account',
            name='is_superuser',
            field=models.BooleanField(verbose_name='superuser status', default=False, help_text='Designates that this user has all permissions without explicitly assigning them.'),
        ),
        migrations.AddField(
            model_name='account',
            name='user_permissions',
            field=models.ManyToManyField(verbose_name='user permissions', blank=True, to='auth.Permission', related_query_name='user', related_name='user_set', help_text='Specific permissions for this user.'),
        ),
    ]
