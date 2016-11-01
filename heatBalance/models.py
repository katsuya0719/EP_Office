from django.db import models

# Create your models here.
class heatBalance(models.Model):
	project=models.CharField(max_length=50)
	sensibleH=models.FloatField()
	sensibleC=models.FloatField()
	surfaceH=models.FloatField()
	surfaceC=models.FloatField()
	peopleH=models.FloatField()
	lightH=models.FloatField()
	equipH=models.FloatField()
	windowH=models.FloatField()
	transferH=models.FloatField()
	infiltrationH=models.FloatField()
	conductionH=models.FloatField()
	equipR=models.FloatField()
	windowR=models.FloatField()
	transferR=models.FloatField()
	infiltrationR=models.FloatField()
	conductionR=models.FloatField()

	class Meta:
		ordering=('project',)