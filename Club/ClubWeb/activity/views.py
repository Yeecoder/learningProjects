from django.shortcuts import render

# Create your views here.

def clubactive(request):
    return render(request,'activity/activity.html')