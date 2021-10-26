# chat/views.py
from django.shortcuts import render
from signinaout.models import User

def index(request):
    return render(request, 'chat/chat_idx.html', {})

def room(request, room_name):
    chat_user = User.objects.get(name=request.session["user_name"])
    return render(request, 'chat/room.html', {
        'room_name': room_name,
        'chat_user' : chat_user,
    })

def one(request, one2one_room_name):
    chat_user = User.objects.get(name=request.session["user_name"])
    print(chat_user)
    return render(request, 'chat/one2one.html',{
        'one2one_room_name' : one2one_room_name,
    })