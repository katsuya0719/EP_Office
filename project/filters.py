import django_filters
from .models import html,project

class ProjectFilter(django_filters.FilterSet):
    #program=django_filters.ChoiceFilter(choices=html.PROGRAM_CHOICES)
    user=django_filters.CharFilter(lookup_expr="iexact")
    project=django_filters.CharFilter(lookup_expr="icontains")
    class Meta:
        model=project
        fields=['project','program','location']

    def __init__(self, *args, **kwargs):
        super(ProjectFilter, self).__init__(*args,**kwargs)
        for name, field in self.filters.items():
            print(name,field)
            if isinstance(field,django_filters.ChoiceFilter):
                field.extra['choices']=tuple([("","Any"), ] + list(field.extra['choices']))
        #self.filters['program'].field.choices.insert('','Any')