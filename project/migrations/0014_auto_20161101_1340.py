# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-11-01 05:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0013_auto_20161101_1202'),
    ]

    operations = [
        migrations.AlterField(
            model_name='html',
            name='version',
            field=models.IntegerField(default=0),
        ),
    ]
