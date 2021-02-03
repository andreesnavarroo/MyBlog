# -*- coding: utf-8 -*-
from __future__ import unicode_literals
# Django
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
# Lib seguimiento de los cambios en los modelos
from simple_history.models import HistoricalRecords

# Modelo User
class User(AbstractUser):
    TIPO_USUARIO = (
        ('ADMINISTRADOR','ADMINISTRADOR'),
        ('USUARIO','USUARIO'),
    )

    tipo_usuario = models.CharField(max_length=25, choices=TIPO_USUARIO, default='ADMINISTRADOR')
    nombre = models.CharField(max_length=50, null=False)
    apellidos = models.CharField(max_length=50, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    status = models.BooleanField(default=True)

    historical = HistoricalRecords()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"


#model administradores
class Autor(User):
    imagen = models.ImageField(upload_to='autor/%Y/%m/%d',  default = 'user.png', null=True, blank=True)
    historical = HistoricalRecords()
    class Meta:
        verbose_name = "Autor"
        verbose_name_plural = "Autores"
        default_permissions = ()


    def __str__(self):
        return str(self.nombre + " " + self.apellidos)
        