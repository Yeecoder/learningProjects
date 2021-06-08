from django.shortcuts import render

from .models import Activity
# Create your views here.

def clubactive(request):
    activities = Activity.objects.all()
    return render(request,'activity/activity.html',locals())

def activity_detail(request,title):
    activity = Activity.objects.get(title = title)
    return render(request,'activity/detail.html',locals())