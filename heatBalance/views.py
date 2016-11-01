from django.shortcuts import render
from heatBalance.models import heatBalance
from heatBalance.serializer import heatBalSerializer
from rest_framework import viewsets

# Create your views here.
class heatBalViewSet(viewsets.ModelViewSet):
	queryset = heatBalance.objects.all()
	serializer_class=heatBalSerializer