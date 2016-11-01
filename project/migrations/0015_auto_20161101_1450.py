# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-11-01 06:50
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0014_auto_20161101_1340'),
    ]

    operations = [
        migrations.AddField(
            model_name='html',
            name='certificate',
            field=models.CharField(choices=[('LEED_v3', 'LEED_v3'), ('LEED_v4', 'LEED_v4'), ('BEAM+', 'BEAM+'), ('WELL', 'WELL')], default=django.utils.timezone.now, max_length=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='html',
            name='program',
            field=models.CharField(choices=[('Office', 'General office'), ('Residential', 'Residential'), ('Retail', 'Retail'), ('Restaurant', 'Restaurant'), ('Gocery store', 'Gocery store'), ('Medilcal office', 'Medilcal office'), ('R&D', 'R&D or laboratory'), ('Hotel', 'Hotel'), ('Daycare', 'Daycare'), ('K-12', 'Educational,K-12'), ('postsecondary', 'Educational,postsecondary')], default=django.utils.timezone.now, max_length=20),
            preserve_default=False,
        ),
    ]