# Utilidades
from __future__ import unicode_literals
import sys
import os
# Django
from django.contrib.auth.models import Group, Permission
# Modelos
from blog.models import Categoria
from usuarios.models import Autor


def run():
    """
        Ejecuta las funciones para que el sistema este OK! ;)
        Crea los roles, categorias y usuarios admin
    """
    grupos()
    categorias()
    usuarios()


def grupos():
    """ Funcion para crear los roles y los permisos de  
        que van hacer usados por los usuarios 
    """
    print("Se estan creando los Grupos y asignando permisos!!!")
    # Si el grupo administrador no existe lo creamos
    if Group.objects.filter(name='ADMINISTRADOR').exists() == False:
        grupo = Group.objects.create(name="ADMINISTRADOR")
        permisos = Permission.objects.all()
        # Asignamos los permisos
        for perm in permisos:
            grupo.permissions.add(perm)

    #  Si el grupo no usuario lo creamos
    if Group.objects.filter(name='USUARIO').exists() == False:
        # Creamos el grupo con el nombre
        grupo = Group.objects.create(name="USUARIO")
        # Buscamos los permisos para luego asignamos
        permisos = Permission.objects.filter(
            codename__in=['add_tag', 'view_post', 'add_post', 'change_post', 'delete_post',
                          'add_like', 'change_like', 'delete_like',
                          'view_comentario', 'add_comentario', 'change_comentario',
                          'delete_comentario'
                          ])
        # Asignamos los permisos
        for perm in permisos:
            grupo.permissions.add(perm)

    print("Los Grupos han sido  creado con exito :)")


def categorias():
    """ 
    Funcion para crear categorias de 
    """
    print("Se estan creando lolas categorias!!!")
    # se verifica si el registro existe
    if Categoria.objects.filter(nombre="PROGRAMACION").exists() == False:
        # se crea el registro
        Categoria.objects.create(nombre="PROGRAMACION")

    if Categoria.objects.filter(nombre="DJANGO").exists() == False:
        Categoria.objects.create(nombre="DJANGO")
    print("las Categorias han sido  creado con exito :)")


def usuarios():
    """ 
        Funcion para crear usuario administrador
        y con el pueda acceder al sistema
    """
    print("Se estan creando Usuario Administrador!!!")
    grupo = Group.objects.get(name='ADMINISTRADOR')
    if Autor.objects.filter(username="admin").exists() == False:
        # Creamos el usuario y lo asignamos al grupo
        instancia = Autor(nombre="administrador", apellidos="navarro", username="admin", tipo_usuario='ADMINISTRADOR')
        instancia.set_password("admin12345")
        instancia.save()
        grupo.user_set.add(instancia)
    print("Administrador ha sido Creado con exito :)")
    print("Muchas Gracias por la espera ;)")