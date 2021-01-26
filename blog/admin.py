from django.contrib import admin
from blog.models import Post, Like

class Posts(admin.ModelAdmin):
    list_filter = ('estado',)
    search_fields = ('id', 'titulo')
    list_display = ('autor', 'categoria', 'titulo')
    
    class Meta:
        model = Post

class Likes(admin.ModelAdmin):
    list_filter = ('estado',)
    search_fields = ('id', 'estado')
    list_display = ('autor', 'post')
    
    class Meta:
        model = Like        

admin.site.register(Post, Posts)
admin.site.register(Like, Likes)