from rest_framework import serializers

from blog.models import Categoria, Post, Like
from usuarios.models import Autor

# Serializer Autor
class SerializerAutor(serializers.ModelSerializer):
    class Meta:
        model = Autor
        write_only_fields = ('password',)
        fields = (
            'id', 'imagen', 'username' ,'tipo_usuario', 'nombre', 'apellidos', 'status', 'is_active',
             'groups')

# Serializer Categoria
class SerializerCategoria(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ('id','nombre','estado','fecha_creacion')

# Serializer Like
class SerializerLike(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ('id','estado','autor', 'post')            

# Serializer Post
class SerializerPost(serializers.ModelSerializer):
    # Likes por post
    like_post = serializers.SerializerMethodField('get_like_post')
    # Cantidad de like por post
    cantidad_like = serializers.ReadOnlyField(source='like_cantidad')
    cantidad_comentarios = serializers.ReadOnlyField(source='comentarios_cantidad')
    # serializer realaciones 
    categoria = SerializerCategoria(read_only=True)
    categoriaID = serializers.PrimaryKeyRelatedField(write_only=True, queryset=Categoria.objects.all(),
                                                         source='categoria' )
    autor = SerializerAutor(read_only=True)

    class Meta:
        read_only_fields = ['autor']
        model = Post
        fields = ('id','titulo','imagen', 'contenido', 'descripcion', 'fecha_publicacion', 'fecha_desactiva', 'publicado','cantidad_like','cantidad_comentarios','autor','categoria','categoriaID', 'like_post')        

    # Obtenemos los likes pertenecientes a cada post 
    def get_like_post(self, obj):
        objetos = Like.objects.filter(post=obj.id).order_by('id')
        return SerializerLike(objetos, many=True, read_only=True).data

 

