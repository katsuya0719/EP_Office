from django.contrib import admin
from .import models

# Register your models here.
admin.site.register(models.html)
admin.site.register(models.location)
admin.site.register(models.program)
admin.site.register(models.project)
admin.site.register(models.scheme)