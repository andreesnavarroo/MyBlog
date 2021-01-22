from rest_framework import serializers

from blog.models import Categoria, Post, Like



# Serializer Categoria
class SerializerCategoria(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ('id','nombre','estado','fecha_creacion')

# Serializer Post
class SerializerPost(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id','autor','categoria','titulo', 'descripcion', 'imagen', 'contenido', 'fecha_publicacion', 'fecha_desactiva', 'publicado')        


# Serializer Like
class SerializerLike(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('id','estado','autor', 'post')        