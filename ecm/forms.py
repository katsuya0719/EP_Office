from django import forms
from ecm.models import ecm
from django.forms import widgets


class DocumentForm(forms.ModelForm):
    class Meta:
        model = ecm
        fields = ['name', 'target', 'description', 'link']
