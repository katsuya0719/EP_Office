from django.db import models
from ecm.models import ecm


def dir_path(instance, filename):
	return 'html/{0}/{1}'.format(instance.project, filename)


# Create your models here.
class html(models.Model):
	project = models.CharField(max_length=50, blank=True)
	version = models.IntegerField(default=0)
	ecms=models.ManyToManyField(ecm, blank=True)
	diff = models.TextField(blank=True)
	PROGRAM_CHOICES = (
		('Office', 'General office'),
		('Residential', 'Residential'),
		('Retail', 'Retail'),
		('Restaurant', 'Restaurant'),
		('Grocery', 'Grocery store'),
		('Medilcal', 'Medilcal office'),
		('Research', 'R&D or laboratory'),
		('Hotel', 'Hotel'),
		('Daycare', 'Daycare'),
		('K-12', 'Educational,K-12'),
		('Postsecondary', 'Educational,postsecondary'),
		('Airport', 'Airport'),
		('DataCenter','Data Center'),
		('DistributionCenter','Distribution center,warehouse')
	)
	program = models.CharField(max_length=20, choices=PROGRAM_CHOICES, default='Retail')
	LOCATION_CHOICES = (
		('Beijing', 'Beijing'),
		('China', 'China'),
		('Hong Kong', 'Hong Kong'),
		('Japan', 'Japan'),
		('Shanghai', 'Shanghai'),
		('Shenzhen', 'Shenzhen'),
		('Taiwan', 'Taiwan')
	)
	location = models.CharField(max_length=15, choices=LOCATION_CHOICES, default="Hong Kong")
	CERTIFICATE_CHOICES = (
		('LEED_v3', 'LEED_v3'),
		('LEED_v4', 'LEED_v4'),
		('BEAM+', 'BEAM+'),
		('WELL', 'WELL')
	)
	certificate = models.CharField(max_length=10, choices=CERTIFICATE_CHOICES, default='BEAM+')
	user = models.CharField(max_length=20, default='test')
	html = models.FileField(upload_to=dir_path)
	uploaded_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.project+"_v"+str(self.version)


class area(models.Model):
	html = models.OneToOneField(html, primary_key=True, on_delete=models.CASCADE)
	total_area = models.IntegerField()
	condition_area = models.IntegerField()
	uncondition_area = models.IntegerField()


class unmet(models.Model):
	html = models.OneToOneField(html, primary_key=True, on_delete=models.CASCADE)
	heating = models.FloatField()
	cooling = models.FloatField()
	ashrae = models.FloatField()


class wwr(models.Model):
	html = models.OneToOneField(html, primary_key=True, on_delete=models.CASCADE)
	total = models.FloatField()
	north = models.FloatField()
	east = models.FloatField()
	south = models.FloatField()
	west = models.FloatField()


class energy(models.Model):
	html = models.OneToOneField(html, primary_key=True, on_delete=models.CASCADE)
	total = models.FloatField()
	euipertotal = models.FloatField()
	euipercondition = models.FloatField()


class loc(models.Model):
	html = models.OneToOneField(html, primary_key=True, on_delete=models.CASCADE)
	cooling=models.CharField(max_length=100, default='test')
	eui=models.CharField(max_length=100, default='test')
	euicon=models.CharField(max_length=100, default='test')
	energy=models.CharField(max_length=100, default='test')
	fan=models.CharField(max_length=100, default='test')
	glass=models.CharField(max_length=100, default='test')
	heatbal=models.CharField(max_length=100, default='test')
	hvac=models.CharField(max_length=100, default='test')
	hw=models.CharField(max_length=100, default='test')
	light=models.CharField(max_length=100, default='test')
	oa=models.CharField(max_length=100, default='test')
	oamin=models.CharField(max_length=100, default='test')
	opaque=models.CharField(max_length=100, default='test')
	pump=models.CharField(max_length=100, default='test')
	unmet=models.CharField(max_length=100, default='test')
	wwr=models.CharField(max_length=100, default='test')
	wwrcon=models.CharField(max_length=100, default='test')
	zone = models.CharField(max_length=100, default='test')


class electricity(models.Model):
	html = models.OneToOneField(html, primary_key=True)
	file = models.FileField(upload_to='electricity')
