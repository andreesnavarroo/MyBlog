from django.urls import path, re_path, include
from rest_framework.urlpatterns import format_suffix_patterns

from . import views
urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    # Urls categorias
    path('api-categorias/', views.ViewCategoria.as_view()),
    path('api-categorias/<int:pk>/', views.CategoriaDetalleView.as_view()),	
    # Urls Posts
    path('api-posts/', views.ViewPost.as_view()),
    path('api-posts-all/', views.ViewPostAll.as_view()),
    path('api-posts/<int:pk>/', views.PostDetalleView.as_view()),	
    path('api-like-posts/', views.CreateBorrarLike.as_view()),	

]
urlpatterns = format_suffix_patterns(urlpatterns)