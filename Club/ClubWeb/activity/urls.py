from django.urls import path

from . import views

app_name = 'activity'

urlpatterns = [
    path('',views.clubactive,name='activity'),
    path('<str:title>',views.activity_detail,name='detail'),
]