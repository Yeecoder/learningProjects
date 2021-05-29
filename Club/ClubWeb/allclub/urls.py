from django.urls import path

from . import views

app_name = 'allclub'

urlpatterns = [
    path('', views.index,name='index'),
    # path('activity/',views.clubactive,name='activity'),
]