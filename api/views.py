# -*- coding: utf-8 -*-

# Utilidades
from __future__ import unicode_literals
import sys

# Django REST framework
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from rest_framework import serializers
from rest_framework.response import Response

# Django
from django.utils import timezone
from django.db import transaction

# Modelos
from blog.models import Categoria
# Serializers
from .serializer import SerializerCategoria

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
            Lista de categorias se obtiene con esta estructura para 
            que pueda ser leida por datatablet
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
            Creamos La Categoria, Validamos que si el Serializer 
            contiene errores, sino creamos el objeto
        """
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid(raise_exception=False):
            data = {'message': serializer.errors, 'code': 5, 'data': None}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        data = {'message': 'Categoria guardada con éxito', 'code': 1, 'data': serializer.data}
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)


# Vista  Detalle Categoria
class CategoriaDetalleView(generics.RetrieveUpdateAPIView):
    queryset = Categoria.objects.all()
    serializer_class = SerializerCategoria
    http_method_names = ['get', 'put']
    permission_classes = (IsAuthenticated,)

    def retrieve(self, request, pk):
        try:
            queryset = Categoria.objects.get(pk=pk)
            serializer = SerializerCategoria(queryset)
            if serializer:
                data = {'message': 'detalle de categorias', 'code': 1, 'data': serializer.data}
                return Response(data, status=status.HTTP_200_OK)
            else:
                data = {'message': 'detalle de categorias', 'code': 1, 'data': None}
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
                data = {'message': serializer.errors, 'code': 5, 'data': None}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            data = {'message': 'Categoria actualizada con éxito', 'code': 1, 'data': serializer.data}
            return Response(data, status=200)
        except Exception:
            e = sys.exc_info()[1]
            data = {'message': e.args[0], 'code': 2, 'data': None}
            return Response(data, status=409)
                                       
