from django.shortcuts import render,redirect
from django.http import JsonResponse

from .models import Activity,Comment
# Create your views here.

def clubactive(request):
    activities = Activity.objects.all()
    return render(request,'activity/activity.html',locals())

def activity_detail(request,title):
    activity = Activity.objects.get(title = title)
    comment_list = Comment.objects.filter(activity_id = activity.pk)
    return render(request,'activity/detail.html',locals())

def comment(request):
    if request.session["user_id"]:
        comment_context = request.POST.get('comment_context')
        activity_id = request.POST.get('activity_id')
        pid = request.POST.get('pid')
        author_id = request.session["user_id"]
        Comment.objects.create(comment_context=comment_context, pre_comment_id=pid, activity_id=activity_id,comment_author_id=author_id)
        activity = list(Comment.objects.values('id','comment_context','pre_comment_id','activity_id','comment_author_id','comment_time'))
        return JsonResponse(activity, safe=False)
    else:
        return redirect('/info/login/')