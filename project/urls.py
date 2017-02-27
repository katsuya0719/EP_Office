"""EnergyPlus URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url,include
from django_filters.views import FilterView
from .filters import ProjectFilter
from rest_framework import routers
from django.contrib import admin
from heatBalance import views
from .views import model_form_upload,ListView,DetailView,basic,ProjectView,heatView,reportView,timeView

app_name="project"
urlpatterns = [
    url(r'^$', ListView.as_view(),name='index'),
    url(r'^search/$', FilterView.as_view(filterset_class=ProjectFilter,template_name='search.html'),name='search'),
    url(r'^(?P<pk>\d+)/$',DetailView.as_view(),name='detail'),
    url(r'^(?P<pk>\d+)/basic$',basic.as_view(),name='basic'),
    url(r'^(?P<pk>\d+)/heat$',heatView.as_view(),name='heat'),
    url(r'^(?P<pk>\d+)/time$',timeView.as_view(),name='time'),
    url(r'^(?P<pk>[\w-]+)/$',ProjectView.as_view(),name='group'),
    url(r'^(?P<pk>[\w-]+)/report$',reportView.as_view(),name='report'),
]
