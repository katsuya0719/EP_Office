from django.forms import ModelForm, inlineformset_factory
from project.models import html,scheme,project
from django.forms import widgets
from django import forms
from dal import autocomplete

class DocumentForm(ModelForm):
    class Meta:
        model = html
        exclude=['scheme']

class SchemeForm(ModelForm):
    class Meta:
        model=scheme
        exclude=['project','configuration','ecms']

htmlFormSet=inlineformset_factory(project,
                                  scheme,
                                  extra=1,
                                  can_delete=False,
                                  form=SchemeForm)

class ProjectForm(ModelForm):
    #location=forms.ModelChoiceField(queryset=project.objects.all(),widget=autocomplete.ModelSelect2(url='project-autocomplete'))
    class Meta:
        model=project
        exclude=()

