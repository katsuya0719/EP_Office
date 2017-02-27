# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-11-17 07:23
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ecm', '0003_auto_20161117_1514'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ecm',
            name='target',
            field=models.CharField(choices=[('Heating', 'Heating'), ('Cooling', 'Cooling'), ('Fan', 'Fan'), ('Lighting', 'Lighting'), ('Equipment', 'Equipment'), ('Renewable', 'Renewable Energy'), ('Hot Water', 'Hot Water System'), ('Others', 'Others')], default='Others', max_length=20),
        ),
    ]
