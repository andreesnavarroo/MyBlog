from django.contrib import admin
from blog.models import Post, Like, Comentario

class Posts(admin.ModelAdmin):
    list_filter = ('estado',)
    search_fields = ('id', 'titulo')
    list_display = ('autor', 'titulo')
    
    class Meta:
        model = Post

class Likes(admin.ModelAdmin):
    list_filter = ('estado',)
    search_fields = ('id', 'estado')
    list_display = ('autor', 'post')
    
    class Meta:
        model = Like        

class Comentarios(admin.ModelAdmin):
    list_filter = ('estado',)
    search_fields = ('id', 'estado')
    list_display = ('autor', 'post','descripcion')
    
    class Meta:
        model = Comentario        

admin.site.register(Post, Posts)
admin.site.register(Like, Likes)
admin.site.register(Comentario, Comentarios)