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
from rest_framework import routers
from django.contrib import admin
from heatBalance import views
from project.views import model_form_upload,basic,helpView,UploadView,form_wizard_view,ProjectAutocomplete

#router=routers.DefaultRouter()
#router.register(r'heat',views.heatBalViewSet)

urlpatterns = [
    #url(r'^', include(router.urls)),
    url(r'^admin/', admin.site.urls),
    url(r'^upload/$',UploadView.as_view(),name='upload'),
    url(r'^wizard/$',form_wizard_view,name="form_wizard_view"),
    url(r'^project/',include('project.urls')),
    url(r'^help/$',helpView.as_view(),name='help'),
    url(r'^ecm/',include('ecm.urls')),
    url(r'^project-autocomplete/$',ProjectAutocomplete.as_view(),name='project-autocomplete')
    #url(r'^project/$',ListView.as_view(),name='project'),
    #url(r'^project/(?P<pk>\d+)/$',DetailView.as_view(),name='detail'),
    #url(r'^project/(?P<pk>\d+)/basic$',basic.as_view(),name='basic'),
]
