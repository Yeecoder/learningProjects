from django.urls import path,include

from . import views

app_name = 'signinaout'

urlpatterns = [
    path('login/', views.login,name='login'),
    path('logout/', views.logout,name='logout'),
    path('register/', views.register,name='register'),
    path('changes/',views.changes,name='changes'),
    path('confirm/',views.user_confirm,name='comfirm'),
    path('idconfirm/',views.idconfirm,name='idconfirm'),
    path('change_password/',views.change_password,name='change_password'),
    path('change_password_confirm/',views.change_password_confirm,name='change_password_confirm'),
]