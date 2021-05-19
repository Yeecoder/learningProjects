from django.db.models import Count
from django.shortcuts import render,redirect

from signinaout.models import User
from .models import ClubInfo
# Create your views here.

def index(request):
    # if not request.session.get('is_login',None):
    #     return redirect('/info/login/')
    if request.session.get('is_login',None):
        user = User.objects.get(name=request.session['user_name'])
    sports = ClubInfo.objects.filter(clubkind='体育运动类')
    literaries = ClubInfo.objects.filter(clubkind='文学艺术类')
    technologys = ClubInfo.objects.filter(clubkind='科技创新类')
    sports_num = len(sports.annotate(Count('clubkind')))
    literaries_num = len(literaries.annotate(Count('clubkind')))
    technologys_num = len(technologys.annotate(Count('clubkind')))

    # context = {'sports':sports,'literaries':literaries,'technologys':technologys}
    return render(request,'allclub/index.html',locals())