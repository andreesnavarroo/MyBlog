
from django.shortcuts import render
from django.template import RequestContext
from django.contrib import admin

# Todos los blogs inicio
def posts(request):
	context = admin.site.each_context(request)
	context.update({'titulo': 'posts',})
	return render(request,'posts.html', context)

# Blogs del usuario logueado
def mis_posts(request):
	context = admin.site.each_context(request)
	context.update({'titulo': 'Mis posts',})
	return render(request,'mis_posts.html', context)	

# Blogs del usuario logueado
def categorias(request):
	context = admin.site.each_context(request)
	context.update({'titulo': 'Categorias',})
	return render(request,'categorias.html', context)		