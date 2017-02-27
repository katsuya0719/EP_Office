from django.db import models

# Create your models here.
class ecm(models.Model):
	name = models.CharField(max_length=50, blank=True)
	TARGET_CHOICES = (
		('Heating', 'Heating'),
		('Cooling', 'Cooling'),
        ('Fan', 'Fan'),
		('Lighting', 'Lighting'),
		('Equipment', 'Equipment'),
        ('Renewable','Renewable Energy'),
        ('Hot Water','Hot Water System'),
		('Others', 'Others'),
	)
	target=models.CharField(max_length=20, choices=TARGET_CHOICES, default='Others')
	description = models.TextField(blank=True)
	link=models.URLField(blank=True)

	def __str__(self):
		return self.name