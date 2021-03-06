
from django.shortcuts import render
from django.template import RequestContext
from django.contrib import admin
from django.contrib.auth.decorators import login_required
import requests
# Modelos
from blog.models import (Autor,Post,Comentario, )

# Todos los blogs inicio
def posts(request):
	context = admin.site.each_context(request)
	context.update({'titulo': 'posts',})
	return render(request,'posts.html', context)

# Blogs del usuario logueado
@login_required
def mis_posts(request):
	autor = Autor.objects.get(pk=request.user.id)
	post = Post.objects.filter(autor=autor)
	data = {
		'post': post
	}
	context = admin.site.each_context(request)
	context.update({'titulo': 'Mis posts',})
	return render(request,'mis_posts.html',  data)	

# Categorias para usuarios admin
@login_required
def categorias(request):
	context = admin.site.each_context(request)
	context.update({'titulo': 'Categorias',})
	return render(request,'categorias.html', context)		


# Detalle Post
def detalle_post(request, pk):
	post = Post.objects.get(pk=pk)
	comentario = Comentario.objects.filter(post=post).order_by('-fecha_creacion')
	autor = Autor.objects.filter(pk=request.user.id).first()
	context = admin.site.each_context(request)
	context.update({'titulo': 'Detalle Post','post': post, 'comentario': comentario, 'autor':autor})
	return render(request,'detalle_post.html', context)			