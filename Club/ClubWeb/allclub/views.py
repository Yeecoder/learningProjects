from django.shortcuts import render,redirect

from .models import ClubInfo
# Create your views here.

def index(request):
    # if not request.session.get('is_login',None):
    #     return redirect('/info/login/')
    sports = ClubInfo.objects.filter(clubkind='体育运动类')
    literaries = ClubInfo.objects.filter(clubkind='文学艺术类')
    technologys = ClubInfo.objects.filter(clubkind='科技创新类')
    context = {'sports':sports,'literaries':literaries,'technologys':technologys}
    return render(request,'allclub/index.html',context)