# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-11-01 07:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0015_auto_20161101_1450'),
    ]

    operations = [
        migrations.AlterField(
            model_name='html',
            name='program',
            field=models.CharField(choices=[('Office', 'General office'), ('Residential', 'Residential'), ('Retail', 'Retail'), ('Restaurant', 'Restaurant'), ('Gocery store', 'Gocery store'), ('Medilcal office', 'Medilcal office'), ('R&D', 'R&D or laboratory'), ('Hotel', 'Hotel'), ('Daycare', 'Daycare'), ('K-12', 'Educational,K-12'), ('Postsecondary', 'Educational,postsecondary'), ('Airport', 'Airport')], max_length=20),
        ),
    ]
