from django.shortcuts import render
from ecm.forms import DocumentForm
from django.http import HttpResponseRedirect, HttpResponse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.views.generic.edit import FormView
from ecm.models import ecm

# Create your views here.
class ListView(ListView):
    model = ecm
    template_name = 'ecm_list.html'

class DetailView(DetailView):
    model = ecm
    template_name = 'ecm_detail.html'

class FormView(FormView):
    form_class=DocumentForm
    template_name='model_form_upload.html'
    success_url='/ecm/'
