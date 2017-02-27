# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2017-01-31 00:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0023_auto_20170121_1256'),
    ]

    operations = [
        migrations.AddField(
            model_name='loc',
            name='zone',
            field=models.CharField(default='test', max_length=100),
        ),
        migrations.AlterField(
            model_name='html',
            name='ecms',
            field=models.ManyToManyField(blank=True, to='ecm.ecm'),
        ),
    ]
