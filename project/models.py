from django.db import models

def dir_path(instance,filename):
	return 'html/{0}/{1}'.format(instance.project,filename)

# Create your models here.
class html(models.Model):
	project=models.CharField(max_length=50,blank=True)
	version=models.IntegerField(default=0)
	diff=models.TextField(blank=True)
	PROGRAM_CHOICES = (
		('Office','General office'),
		('Residential','Residential'),
		('Retail', 'Retail'),
		('Restaurant','Restaurant'),
		('Gocery store','Gocery store'),
		('Medilcal office','Medilcal office'),
		('R&D','R&D or laboratory'),
		('Hotel','Hotel'),
		('Daycare','Daycare'),
		('K-12','Educational,K-12'),
		('Postsecondary','Educational,postsecondary'),
		('Airport','Airport')
	)
	program=models.CharField(max_length=20,choices=PROGRAM_CHOICES)
	LOCATION_CHOICES = (
		('Beijing','Beijing'),
		('China','China'),
		('Hong Kong', 'Hong Kong'),
		('Japan','Japan'),
		('Shanghai','Shanghai'),
		('Shenzhen','Shenzhen'),
		('Taiwan','Taiwan')
	)
	location=models.CharField(max_length=15,choices=LOCATION_CHOICES)
	CERTIFICATE_CHOICES = (
		('LEED_v3','LEED_v3'),
		('LEED_v4','LEED_v4'),
		('BEAM+', 'BEAM+'),
		('WELL','WELL')
	)
	certificate=models.CharField(max_length=10,choices=CERTIFICATE_CHOICES)
	user=models.CharField(max_length=20)
	html=models.FileField(upload_to=dir_path)
	uploaded_at=models.DateTimeField(auto_now_add=True)
	
	def __str__(self):
		return self.project

class basic(models.Model):
	html=models.OneToOneField(html,primary_key=True)
	total_area=models.IntegerField()
	condition_area=models.IntegerField()
	uncondition_area=models.IntegerField()

class electricity(models.Model):
	html=models.OneToOneField(html,primary_key=True)
	file=models.FileField(upload_to='electricity')

