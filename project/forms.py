from django import forms
from project.models import html
from django.forms import widgets

class DocumentForm(forms.ModelForm):
	"""
	def __init__(self,*args,**kwargs):
		super(DocumentForm,self).__init__(*args,**kwargs)
		self.fields['program'].empty_label = None
	"""
		
	class Meta:
		model=html
		fields=['project','version','diff','program','location','certificate','user','html']