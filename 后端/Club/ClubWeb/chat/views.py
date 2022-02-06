# chat/views.py
from django.shortcuts import render
from signinaout.models import User
import re

def index(request):
    return render(request, 'chat/chat_idx.html', {})

def room(request, room_name):
    chat_user = User.objects.get(name=request.session["user_name"])
    return render(request, 'chat/room.html', {
        'room_name': room_name,
        'chat_user' : chat_user,
    })

def one(request, one2oneroom_name):
    cur_user_id = re.findall(r'(\d+)_(\d+)',one2oneroom_name)[0][0]
    received_user_id = re.findall(r'(\d+)_(\d+)',one2oneroom_name)[0][1]
    cur_user = User.objects.get(id = cur_user_id)
    to_user = User.objects.get(id = received_user_id)
    return render(request, 'chat/one2one.html',{
        'one2one_room_name' : to_user,
        'cur_user' : cur_user,
        'to_user' : to_user,
    })