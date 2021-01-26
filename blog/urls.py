from django.urls import path, include
from . import views
from blog import views
urlpatterns = [
    path('posts', views.posts, name='posts'),
    path('mis_posts', views.mis_posts, name='mis_posts'),
    path('categorias', views.categorias, name='categorias'),
    path('detalle_post/<int:pk>', views.detalle_post),
]