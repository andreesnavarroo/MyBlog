from django.contrib import admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from usuarios.forms import (CustomUserChangeForm, CustomUserCreationForm)
from .models import ( User, Autor)


# Register your models here.
class Usuarios(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm

    fieldsets = (
        (None, {'fields': ( 'username', 'password', 'is_admin', 'groups')}),
        ('Information', {'fields': ('tipo_usuario', 'date_joined', 'last_login',)}),
        ('Permissions', {'fields': ('is_active',)}),

    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ( 'username', 'password1', 'password2', 'is_active', 'is_admin', 'groups', 'is_active',
            'is_admin', 'groups')}
         ),
    )
    # filter_horizontal = ('',)
    list_filter = ('is_active', 'is_admin', 'tipo_usuario',)
    search_fields = ('id',  'username', 'tipo_usuario',)
    list_display = ['id', 'tipo_usuario', 'username',  'is_active', 'date_joined', 'last_login']

    class Meta:
        model = User

class Autors(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    """ admin para los Autores """

    fieldsets = (
        (None, {'fields': ( 'username', 'password','imagen')}),
        ('Information personal', {'fields': ('nombre',  'apellidos',)}),
        ('Information account', {'fields': ( 'tipo_usuario', 'status', 'date_joined', 'last_login',)}),
        ('Permissions', {'fields': ('is_active', 'is_admin', 'groups')}),

    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
             'tipo_usuario',  'username', 'password1', 'password2', 'nombre','apellidos',
              'is_active', 'status', 'is_admin', 'groups')}
         ),
    )

    list_filter = ('status', )
    search_fields = ('id', 'username',  'nombre', 'apellidos',)
    list_display = ['id',  'nombre', 'status', 'created_at', 'updated_at',
                    'deleted_at']

    class Meta:
        model = Autor        

admin.site.register(User, Usuarios)
admin.site.register(Autor, Autors)