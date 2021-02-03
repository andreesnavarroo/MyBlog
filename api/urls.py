from django.urls import path, re_path, include
from rest_framework.urlpatterns import format_suffix_patterns

from . import views
urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    # Url Registrar usuario
    path('api-register-usuario/', views.UsuarioRegisterView.as_view()),

    # Urls categorias
    path('api-categorias/', views.ViewCategoria.as_view()),
    path('api-categorias/<int:pk>/', views.CategoriaDetalleView.as_view()),	
    # Urls Posts
    path('api-posts/', views.ViewPost.as_view()),
    path('api-posts-all/', views.ViewPostAll.as_view()),
    path('api-posts/<int:pk>/', views.PostDetalleView.as_view()),	
    path('api-like-posts/', views.CreateBorrarLike.as_view()),

    # Urls Crear Comentarios (recibe id del post)
    path('api-comentario/<int:pk>/', views.ViewComentario.as_view()),    	
    # Editar comentario Tambn eliminar
    path('api-comentario/editar/<int:pk>/', views.ComentarioDetalleView.as_view()),	
]
urlpatterns = format_suffix_patterns(urlpatterns)