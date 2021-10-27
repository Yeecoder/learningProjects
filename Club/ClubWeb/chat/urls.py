# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
   path('', views.index, name='index'),
   path('<str:room_name>/', views.room, name='room'),
   path('one2one/<str:one2oneroom_name>/',views.one,name='one2oneroom')
]