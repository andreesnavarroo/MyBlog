
from django.shortcuts import render
from django.template import RequestContext
from django.contrib import admin
from django.contrib.auth.decorators import login_required
import requests
# Modelos
from blog.models import (Autor,Post )
# Todos los blogs inicio
def posts(request):
	context = admin.site.each_context(request)
	context.update({'titulo': 'posts',})
	return render(request,'posts.html', context)

# Blogs del usuario logueado
@login_required
def mis_posts(request):
	# Obtenemos los posts
	# response = requests.get( "{% url 'api-posts' %}" )
	# Transformamos la respuesta a objetos json
	# posts = response.json()
	
	autor = Autor.objects.get(pk=request.user.id)
	print(autor)
	post = Post.objects.filter(autor=autor)
	data = {
		'post': post
	}
	print(data)
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
	context = admin.site.each_context(request)
	context.update({'titulo': 'Detalle Post','post': post})
	return render(request,'detalle_post.html', context)			