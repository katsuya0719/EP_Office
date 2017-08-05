from django.shortcuts import render,get_object_or_404
from project.models import html, area, unmet, wwr, energy, loc,scheme,project
from project.forms import DocumentForm,htmlFormSet
from django.http import HttpResponseRedirect, HttpResponse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.views.generic import CreateView
from libs.EPprocessing.main import ProcessHtml
# from EnergyPlus import settings
from django.core.files import File
import os
import pandas
from django.conf import settings
from django.core.urlresolvers import reverse
from io import BytesIO
import zipfile
from io import StringIO
from django.db import transaction

# Create your views here.
class ListView(ListView):
    model = html
    # queryset=html.objects.all()
    # print(queryset)
    template_name = 'project_list.html'

class DetailView(DetailView):
    model = html
    template_name = 'project_detail.html'

    def makepath(self, data, strcsv):
        abspath = str(os.path.join((os.path.dirname(data["object"].html.path)), strcsv))
        strpath = abspath[len(settings.MEDIA_ROOT):].replace("\\", "/")
        return strpath

    def get_context_data(self, **kwargs):
        data = super().get_context_data(**kwargs)

        strpath1 = self.makepath(data, "Zone.csv")
        data["zone"] = "../../static" + strpath1
        print(self.object.ecms.all())
        data['ecms']=self.object.ecms.all()
        print(data['ecms'])
        return data


class ProjectView(ListView):
    #queryset=html.objects.all()
    model=html
    template_name = 'project_group.html'
    def get_queryset(self):
        qs=super(ProjectView,self).get_queryset()
        return qs.filter(project=self.kwargs['pk'])


class basic(DetailView):
    template_name = 'basic_info.html'

class heatView(DetailView):
    template_name = 'heat_balance.html'

class reportView(DetailView):
    template_name = 'report.html'

class timeView(ListView):
    template_name="timeseries.html"

class helpView(ListView):
    template_name="help.html"

def download_csv(request,pk):
    #query the data we want to download
    obj=html.objects.get(pk=pk)
    loc=obj.loc
    fields=loc._meta.get_fields()
    filenames=[]
    for f in fields:
        csvpath=getattr(loc, f.name)
        if str(csvpath).endswith("csv"):
            filenames.append(csvpath)

    print(filenames[0])
    zip_subdir = "result_csv"
    zip_filename = "%s.zip" % zip_subdir

    s=StringIO()
    b=BytesIO()
    zf = zipfile.ZipFile(b, 'w')

    for fpath in filenames:
        fdir,fname=os.path.split(fpath)
        zip_path=os.path.join(zip_subdir,fname)
        #print(zip_path)

        fpath1=fpath[6:].replace("static","data")
        zf.write(fpath1)
    zf.close()

    response=HttpResponse(b.getvalue(),content_type = "application/x-zip-compressed")
    response['Content-Disposition'] = 'attachment; filename=%s' % zip_filename

    return response

class UploadView(CreateView):
    model = scheme
    fields = ['project','scheme','configuration']
    template_name = 'scheme_form.html'
    #success_url = reverse('project:index')

    def get_context_data(self,**kwargs):
        data = super(UploadView,self).get_context_data(**kwargs)
        if self.request.POST:
            data['versions'] = htmlFormSet(self.request.POST)

        else:
            data['versions']=htmlFormSet()

        return data

    def form_valid(self, form):
        context = self.get_context_data()
        versions = context['versions']
        with transaction.atomic():
            self.object = form.save()

            if versions.is_valid():
                versions.instance = self.object
                versions.save()
            return super(UploadView,self).form_valid(form)


def model_form_upload(request):
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        print (form)
        if form.is_valid():
            newhtml = form.save()
            # newDoc=html(html=request.FILES['html'])
            newhtml.save()

            queryset = html.objects.all().last()
            dest = os.path.dirname(queryset.html.path)+str(queryset.version)

            db = process_html(queryset.html.path, dest)

            register_area(db["Area"], area, newhtml)
            register_unmet(db["Unmet"], unmet, newhtml)
            register_wwr(db["WWR"], wwr, newhtml)
            register_ene(db["EUI"], energy, newhtml)

            #root=dest+"\\"
            root="../../static"+dest[len(settings.MEDIA_ROOT):].replace("\\", "/")+"/"
            print("directory:"+root)
            colList=["Cooling","ELUI","ELUIcon","Energy","Fan","Glass","HeatBalance","HVAC","HW","Light","OAaverage","OAmin","Opaque","Pump","UnmetDetail","WWR","WWRcon","Zone"]
            ext=".csv"
            register_loc(root,ext,colList,loc,newhtml)

            return HttpResponseRedirect(reverse('project:index'))
    else:
        form = DocumentForm()

    return render(request, 'model_form_upload.html', {'form': form})
    documents = html.objects.all()


def register_loc(r,e,l,strDB,parentDB):
    db=strDB(html=parentDB,cooling=r+l[0]+e,eui=r+l[1]+e,euicon=r+l[2]+e,energy=r+l[3]+e,fan=r+l[4]+e,glass=r+l[5]+e,heatbal=r+l[6]+e,hvac=r+l[7]+e,hw=r+l[8]+e,light=r+l[9]+e,oa=r+l[10]+e,oamin=r+l[11]+e,opaque=r+l[12]+e,pump=r+l[13]+e,unmet=r+l[14]+e,wwr=r+l[15]+e,wwrcon=r+l[16]+e,zone=r+l[17]+e)
    db.save()


def register_area(df, strDB, parentDB):
    db = strDB(html=parentDB, total_area=df.iloc[1, 1], condition_area=df.iloc[2, 1], uncondition_area=df.iloc[3, 1])
    db.save()


def register_unmet(df, strDB, parentDB):
    db = strDB(html=parentDB, heating=df.iloc[1, 1], cooling=df.iloc[2, 1], ashrae=df.iloc[3, 1])
    db.save()


def register_wwr(df, strDB, parentDB):
    print(df.iloc[5, 0])
    db = strDB(html=parentDB, total=df.iloc[5, 1], north=df.iloc[5, 2], east=df.iloc[5, 3], south=df.iloc[5, 4],
               west=df.iloc[5, 5])
    db.save()


def register_ene(df, strDB, parentDB):
    print(df.iloc[1, 0])
    db = strDB(html=parentDB, total=df.iloc[1, 1], euipertotal=df.iloc[1, 2], euipercondition=df.iloc[1, 3])
    db.save()


def process_html(html, dest):
    case = ProcessHtml(file=html)
    db = case.extract_html()
    # print (db["Unmet"])
    # register_df(db["Area"],area)
    case.export_all(dest)
    return db

