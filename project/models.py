from django.db import models
from ecm.models import ecm


def dir_path(instance, filename):
	return 'html/{0}/{1}'.format(instance.project, filename)

def epw_path(instance, filename):
	return 'epw/{0}'.format(filename)

# Create your models here.
class location(models.Model):
	name=models.CharField(max_length=50,blank=True)
	epw=models.FileField(upload_to=epw_path)

	def __str__(self):
		return self.name

class program(models.Model):
	program=models.CharField(max_length=30)

	def __str__(self):
		return self.program

class project(models.Model):
	project = models.CharField(max_length=50, blank=True)
	location=models.ForeignKey(location,related_name='project')
	program=models.ForeignKey(program,related_name='project')

	def __str__(self):
		return self.project

class scheme(models.Model):
	project=models.ForeignKey(project,related_name='schemes',on_delete=models.CASCADE)
	SCHEME_CHOICES = (
		('LEED_v3_baseline', 'LEED_v3_baseline'),
		('LEED_v4_baseline', 'LEED_v4_baseline'),
		('BEAM+_baseline', 'BEAM+_baseline'),
		('Proposed', 'Proposed')
	)
	scheme = models.CharField(max_length=30, choices=SCHEME_CHOICES, default='BEAM+_baseline')
	configuration=models.TextField()
	ecms = models.ManyToManyField(ecm, blank=True)

class html(models.Model):
	scheme=models.ForeignKey(scheme,related_name='html',on_delete=models.CASCADE)
	version = models.IntegerField(default=0)
	diff = models.TextField(blank=True)
	html = models.FileField(upload_to=dir_path)
	uploaded_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.scheme+"_v"+str(self.version)


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
