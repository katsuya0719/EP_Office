# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-11-02 03:37
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0017_auto_20161102_1052'),
    ]

    operations = [
        migrations.AlterField(
            model_name='html',
            name='certificate',
            field=models.CharField(choices=[('LEED_v3', 'LEED_v3'), ('LEED_v4', 'LEED_v4'), ('BEAM+', 'BEAM+'), ('WELL', 'WELL')], default='BEAM+', max_length=10),
        ),
        migrations.AlterField(
            model_name='html',
            name='location',
            field=models.CharField(choices=[('Beijing', 'Beijing'), ('China', 'China'), ('Hong Kong', 'Hong Kong'), ('Japan', 'Japan'), ('Shanghai', 'Shanghai'), ('Shenzhen', 'Shenzhen'), ('Taiwan', 'Taiwan')], default='Hong Kong', max_length=15),
        ),
        migrations.AlterField(
            model_name='html',
            name='program',
            field=models.CharField(choices=[('Office', 'General office'), ('Residential', 'Residential'), ('Retail', 'Retail'), ('Restaurant', 'Restaurant'), ('Gocery store', 'Gocery store'), ('Medilcal office', 'Medilcal office'), ('R&D', 'R&D or laboratory'), ('Hotel', 'Hotel'), ('Daycare', 'Daycare'), ('K-12', 'Educational,K-12'), ('Postsecondary', 'Educational,postsecondary'), ('Airport', 'Airport')], default='Retail', max_length=20),
        ),
        migrations.AlterField(
            model_name='html',
            name='user',
            field=models.CharField(default='test', max_length=20),
        ),
    ]
