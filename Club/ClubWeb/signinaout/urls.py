from django.urls import path,include

from . import views

app_name = 'signinaout'

urlpatterns = [
    path('login/', views.login,name='login'),
    path('logout/', views.logout,name='logout'),
    path('register/', views.register,name='register'),
    path('changes/',views.changes,name='changes'),
    path('confirm/',views.user_confirm,name='comfirm'),
]