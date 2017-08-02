from django.forms import ModelForm, inlineformset_factory
from project.models import html,scheme,project
from django.forms import widgets


class DocumentForm(ModelForm):
    class Meta:
        model = html
        exclude=()

htmlFormSet=inlineformset_factory(scheme,html,form=DocumentForm)

