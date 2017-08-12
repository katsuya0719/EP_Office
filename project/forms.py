from django.forms import ModelForm, inlineformset_factory
from project.models import html,scheme,project
from django.forms import widgets

class DocumentForm(ModelForm):
    class Meta:
        model = html
        exclude=()

class SchemeForm(ModelForm):
    class Meta:
        model=scheme
        exclude=()

htmlFormSet=inlineformset_factory(project,
                                  scheme,
                                  extra=1,
                                  can_delete=False,
                                  form=SchemeForm)

class ProjectForm(ModelForm):
    class Meta:
        model=project
        exclude=()

