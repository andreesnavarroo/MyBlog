from django.urls import path, re_path, include
from . import views

urlpatterns = [
    path('login',  views.login, name='login')
]
