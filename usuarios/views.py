from django.shortcuts import render
from django.contrib import admin


def login(request):
	context = admin.site.each_context(request)
	context.update({'titulo': 'login',})
	return render(request, 'registration/login.html', context)


def register(request):
	context = admin.site.each_context(request)
	context.update({'titulo': 'Register',})
	return render(request, 'registration/register.html', context)

