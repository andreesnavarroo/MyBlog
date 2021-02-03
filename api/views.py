# -*- coding: utf-8 -*-

# Utilidades
from __future__ import unicode_literals
import sys
from datetime import date

# Django REST framework
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
# Django
from django.utils import timezone
from django.db import transaction
from django.db.models import  Q
from django.contrib.auth.models import Group
# Modelos
from blog.models import (Categoria,Post, Like, Comentario)
from usuarios.models import Autor
# Serializers
from .serializer import (SerializerCategoria, SerializerPost, SerializerLike, SerializerComentario, RegisterUsuarioSerializer)

# Filtros 
from .query import filtro_categoria

# Vista Categorias
class ViewCategoria(generics.ListCreateAPIView):
    queryset = Categoria.objects.filter(fecha_eliminacion=None)
    http_method_names = ['get', 'post']
    serializer_class = SerializerCategoria
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """
            Lista de categorias se obtiene con esta estructura (diccionario)
            'draw','recordsTotal','recordsFiltered' para q datatables con estos datos
            listar y paginar correctamente
        """
        query = Categoria.objects.filter(fecha_eliminacion=None)
        queryset = self.filter_queryset(query)
        categoria = filtro_categoria(queryset, **request.query_params)
        serializer = SerializerCategoria(categoria['items'], many=True)
        result = dict()
        result['message'] = 'Categorias'
        result['code'] = 1
        result['data'] = serializer.data
        result['draw'] = categoria['draw']
        result['recordsTotal'] = categoria['total']
        result['recordsFiltered'] = categoria['count']
        if serializer:
            return Response(result, status=200, template_name=None, content_type=None)
        else:
            result = dict()
            result['message'] = 'Categorias'
            result['code'] = 1
            result['data'] = None
            result['draw'] = 0
            result['recordsTotal'] = 0
            result['recordsFiltered'] = 0
            return Response(result, status=200, template_name=None, content_type=None)

    def create(self, request, *args, **kwargs):
        """
            Creamos La Categoria, Validamos si el Serializer 
            contiene errores, sino creamos el objeto
        """
        # Serializamos 
        serializer = self.get_serializer(data=request.data)
        # Si serializer el valido
        if serializer.is_valid(): 
            # perform_create llama a serializer.save() 
            self.perform_create(serializer)
            return Response({'data': serializer.data}, status=status.HTTP_201_CREATED,)
        return Response({'data': serializer.errors}, status=status.HTTP_400_BAD_REQUEST, )


# Vista  Detalle Categoria
class CategoriaDetalleView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categoria.objects.all()
    serializer_class = SerializerCategoria
    http_method_names = ['get', 'put','delete']
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, pk):
        try:
            queryset = Categoria.objects.get(pk=pk)
            serializer = SerializerCategoria(queryset)
            if serializer:
                data = {'data': serializer.data}
                return Response(data, status=status.HTTP_200_OK)
            else:
                data = {'data': None}
                return Response(data, status=status.HTTP_200_OK)
        except Exception:
            e = sys.exc_info()[1]
            data = {'message': e.args[0], 'code': 2, 'data': None}
            return Response(data, status=409)

    def put(self, request, pk):
        try:
            instance = self.queryset.get(pk=pk)
            request.data['updated_at'] = timezone.now()
            serializer = self.serializer_class(instance, data=request.data, partial=True)
            if not serializer.is_valid(raise_exception=False):
                data = {'data': serializer.errors}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            data = {'data': serializer.data}
            return Response(data, status=200)
        except Exception:
            e = sys.exc_info()[1]
            data = {'message': e.args[0], 'code': 2, 'data': None}
            return Response(data, status=409)

    def delete(self, request, pk):  
        # Eliminamos categoria
        try:           
            instance = self.queryset.get(pk=pk)
            instance.delete()
            data = {'data': None}
            return Response(data, status=200)
        except Exception:
            e = sys.exc_info()[1]
            data = {'message': e.args[0], 'code': 2, 'data': None}
            return Response(data, status=409)                      
                                       
# Vista Post 
class ViewPost(generics.ListCreateAPIView):
    queryset = Post.objects.filter(fecha_eliminacion=None)
    http_method_names = ['get', 'post']
    serializer_class = SerializerPost
    permission_classes = (IsAuthenticated,)
    
    def get(self, request):
        """
            Listamos los Posts si es 'ADMINISTRADOR' tiene q ver todos los posts,
            sino solo puede ver los Posts creados por el mismo 
        """
        autor = Autor.objects.get(pk=request.user.id)
        if autor.tipo_usuario == 'ADMINISTRADOR':
            query = Post.objects.all().order_by('-fecha_creacion')
        else:
            query = Post.objects.filter(autor=autor).order_by('-fecha_creacion')    
        queryset = self.filter_queryset(query)
        serializer = SerializerPost(queryset, many=True, context={'request': request})
        if serializer:
            return Response({'data': serializer.data, },status=200)
        else:
            return Response({'data': None,},status=200)

    def create(self, request, *args, **kwargs):
        """
        """
        print('1',request.data)   
        request.data._mutable = True
        request.data['tags'] = list(request.data['tags'].split(",")) 
        request.data['categorias'] = list(request.data['categorias'].split(",")) 
        request.data._mutable = False
        serializer = self.get_serializer(data=request.data)
        print('2',request.data)   
        if not serializer.is_valid(raise_exception=False):
            raise Exception(serializer.errors)        
            # Buscamos el autor para usarlo al guardar el post
        autor = Autor.objects.get(pk=request.user.id)
            # Guardamos el post con el autor(usuario actual)
        instance = serializer.save(autor=autor) 

        if 'categorias' in request.data:
            for categorias in request.data['categorias']:
                cats = Categoria.objects.filter(pk=int(categorias))
                cats = cats.first()
                instance.categorias.add(cats)
        serializer = SerializerPost(instance)
        return Response({'data': serializer.data}, status=status.HTTP_201_CREATED,)
        

# Vista Post All (View para el Inicio)
class ViewPostAll(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = SerializerPost
    filter_backends = [filters.SearchFilter]
    # Usamos Filter de DRF y filtramos por estos campos
    search_fields = ['titulo','autor__nombre',]

    def get(self, request):
        """
            Listamos todos los Posts, filtramos por las fechas de publicacion
        """
        fecha_actual = date.today()
        # buscador = self.request.GET.get('buscador')
        query = Post.objects.filter(Q(fecha_publicacion__lte = fecha_actual,fecha_desactiva__gte = fecha_actual)).order_by('-fecha_creacion')
        # if buscador:
        #     query = Post.objects.filter(Q(fecha_publicacion__lte = fecha_actual,fecha_desactiva__gte = fecha_actual), titulo__contains=buscador) 
        queryset = self.filter_queryset(query)
        serializer = SerializerPost(queryset, many=True, context={'request': request})
        if serializer:
            return Response({'data': serializer.data,},status=200)
        else:
            return Response({'data': None,},status=200)

# Vista  detalle Post
class PostDetalleView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = SerializerPost
    http_method_names = ['get', 'put','delete']
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, pk):
        try:
            queryset = Post.objects.get(pk=pk)       
            serializer = SerializerPost(queryset)
            if serializer:
                data = {'data': serializer.data}
                return Response(data, status=status.HTTP_200_OK)
            else:
                data = {'data': None}
                return Response(data, status=status.HTTP_200_OK)
        except Exception:
            e = sys.exc_info()[1]
            data = {'message': e.args[0], 'code': 2, 'data': None}
            return Response(data, status=409)

    def put(self, request, pk):
        try:
            tags = list(request.data['tags'].split(",")) 
            # print(tags)
            # print(request.data['tags'])
            print(request.data)
            categorias = list(request.data['categorias'].split(",")) 
            post = Post.objects.filter(pk=pk).update(titulo=request.data['titulo'],
                            contenido=request.data['contenido'],fecha_modificacion=timezone.now(), fecha_publicacion=request.data['fecha_publicacion'],
                            fecha_desactiva=request.data['fecha_desactiva'],descripcion=request.data['descripcion'] )
            print('post',post)     
            # post.tags.add(tags)                       
            # serializer = SerializerPost(post)
            # if 'categorias' in request.data:
            #         for categorias in request.data['categorias']:
            #             cats = Categoria.objects.filter(pk=categorias)
            #             cats = cats.first()
            #             post.categorias.add(cats)
            serializer = SerializerPost(post)
            return Response({'data': serializer.data}, status=status.HTTP_200_OK,)            
            
        #     request.data._mutable = True
        #     request.data._mutable = False    
        #     print('2',request.data)        
        #     instance = self.queryset.get(pk=pk)
        #     request.data['updated_at'] = timezone.now()
        #     serializer = self.serializer_class(instance, data=request.data)
        #     # if not serializer.is_valid(raise_exception=False):
        #     #     data = {'data': serializer.errors}
        #     #     return Response(data, status=status.HTTP_400_BAD_REQUEST)
        #     instance = serializer.save(tags=tags,categorias=categorias)
        #     if 'categorias' in request.data:
        #         for categorias in request.data['categorias']:
        #             cats = Categoria.objects.filter(pk=int(categorias))
        #             cats = cats.first()
        #             instance.categorias.add(cats)
        #     serializer = SerializerPost(instance)
        #     return Response({'data': serializer.data}, status=status.HTTP_200_OK,)
        except Exception:
            e = sys.exc_info()[1]
            data = {'message': e.args[0], 'code': 2, 'data': None}
            return Response(data, status=409)

    def delete(self, request, pk):  
        # Eliminamos el Post
        try:           
            instance = self.queryset.get(pk=pk)
            instance.delete()
            data = {'data': None}
            return Response(data, status=200)
        except Exception:
            e = sys.exc_info()[1]
            data = {'message': e.args[0], 'code': 2, 'data': None}
            return Response(data, status=409)             

# Vista Crear Comentario (recibe pk del post)
class ViewComentario(generics.ListCreateAPIView):
    queryset = Comentario.objects.filter(fecha_eliminacion=None)
    http_method_names = ['post']
    serializer_class = SerializerComentario
    def create(self, request, pk, *args, **kwargs):
        """
            Creamos el comentario y le asignamos el autor y el post,
            Validamos si el Serializer contiene errores, sino creamos el objeto
        """
        try:
            # Serializamos 
            serializer = self.get_serializer(data=request.data)
            # Si serializer el valido
            if serializer.is_valid(): 
                # Buscamos el autor para usuario al guardar el comentario
                autor = Autor.objects.filter(pk=request.user.id).first()
                if autor !=None:
                    # Buscamos el post
                    post = Post.objects.get(pk=pk)
                    # Guardamos el comentario
                    serializer.save(autor=autor,post=post) 
                    return Response({'data': serializer.data}, status=status.HTTP_201_CREATED,)
                return Response({'data': None}, status=200,)    
            return Response({'data': serializer.errors}, status=status.HTTP_400_BAD_REQUEST,)
        except Exception:
            e = sys.exc_info()[1]
            data = {'message': e.args[0], 'code': 2, 'data': None}
            return Response(data, status=409)


# Vista  Detalle Comentario
class ComentarioDetalleView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comentario.objects.all()
    serializer_class = SerializerComentario
    http_method_names = ['get', 'put','delete']
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, pk):
        try:
            queryset = Comentario.objects.get(pk=pk)
            serializer = SerializerComentario(queryset)
            if serializer:
                data = {'data': serializer.data}
                return Response(data, status=status.HTTP_200_OK)
            else:
                data = {'data': None}
                return Response(data, status=status.HTTP_200_OK)
        except Exception:
            e = sys.exc_info()[1]
            data = {'message': e.args[0], 'code': 2, 'data': None}
            return Response(data, status=409)

    def put(self, request, pk):
        """
            Editar Comentario
        """
        try:
            instance = self.queryset.get(pk=pk)
            request.data['updated_at'] = timezone.now()
            serializer = self.serializer_class(instance, data=request.data, partial=True)
            if not serializer.is_valid(raise_exception=False):
                data = {'data': serializer.errors}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            data = {'data': serializer.data}
            return Response(data, status=200)
        except Exception:
            e = sys.exc_info()[1]
            data = {'message': e.args[0], 'code': 2, 'data': None}
            return Response(data, status=409)

    def delete(self, request, pk):  
        # Eliminamos el comentario
        try:           
            instance = self.queryset.get(pk=pk)
            instance.delete()
            data = {'data': None}
            return Response(data, status=200)
        except Exception:
            e = sys.exc_info()[1]
            data = {'message': e.args[0], 'code': 2, 'data': None}
            return Response(data, status=409)          
            
# Vista crear y borrar like
class CreateBorrarLike(APIView):
    def post(self,request):
        """
            Recibimos desde el front el pk del post
            validamos si el post tiene un like asignado por ese 
            usuario, si lo tiene asignado lo borramos, sino se crea el like
            (un post solo puede tener un like por usuario)
        """
        try:
            # Recibimos la pk del post
            if request.data['pk_post']:
                pk_post = request.data['pk_post']
                # Obtenemos el autor
                autor = Autor.objects.filter(pk=request.user.id).first()
                if autor !=None:
                    # Obtenemos el post
                    post = Post.objects.get(pk=pk_post)
                    # Buscamos si este usuario tiene un like asignado a ese post 
                    like = Like.objects.filter(autor=autor, post=post).first()
                    # Si tiene like asignado                          
                    if like !=None:
                        # Eliminamos el like
                        like.delete()
                        data = {'message': 'Like quitado', 'code': 1, }
                        return Response(data, status=200)
                    # Creamos like
                    else:
                        instance = Like.objects.create(post=post, autor=autor)
                        serializer = SerializerLike(instance)
                        data = {'message': 'Like asignado', 'code': 1, 'data':serializer.data}
                        return Response(data, status=200)
                else:
                    data = {'message': 'Por Favor Iniciar Sesion', 'code': 2, 'data':None}
                    return Response(data, status=200)                        
        except Exception:
            e = sys.exc_info()[1]
            data = {'message': e.args[0], 'code': 2, 'data': None}
            return Response(data, status=409)




# Vistra crear Usuario
class UsuarioRegisterView(generics.ListCreateAPIView):
    queryset = Autor.objects.filter(deleted_at=None)
    serializer_class = RegisterUsuarioSerializer
    http_method_names = ['post']
    """
        Aqui se crean los usuarios q se registrar por 
        el formulario de registro
    """

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid(raise_exception=False):
            data = {'data': serializer.errors}
            return Response(data, status=409)
        instance = serializer.save(tipo_usuario='USUARIO', is_active=True, status=True)
        # Encriptramos la contraseña
        instance.set_password(request.data['password'])
        # Guardamos
        instance.save()
        # Buscamos el grupo
        group = Group.objects.get(name='USUARIO')
        # Asignamos el grupo
        group.user_set.add(instance)
        headers = self.get_success_headers(serializer.data)
        data = {'message':'Usuario Creado','data': serializer.data}
        return Response(data, status=200, headers=headers)

    