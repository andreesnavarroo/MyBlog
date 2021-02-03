
# Blog 📋
```bash
# Introduccion
Cuenta con Login y registro de usuarios
En Este Blog se pueden publicar posts Y filtrar por titulo y autor+
los posts tienen categorias y tags
se manejan 2 tipos de usuarios (ADMINISTRADOR Y USUARIO)
* ADMINISTRADOR:
tiene todos los permisos, y solo ellos pueden modificar y eliminar posts de otro usuarios
* USUARIO:
Tienes permisos para crear y modificar sus propios posts
pueden dar like y quitar like
* Usuario no autenticado solo puede ver los posts, no puede crear ni comentar ni dar like




```

### Dependencia 📋
```
Python 3 Django

```

### Instalación 🔧

```bash
# Crear entorno virtual y activar
pip install virtualenv MiEntorno
# activar entorno virtual ir a la ruta y ejecutar activate
:\>c:\ruta\al\entorno\virtual\scripts\activate.bat
# Instalar los requerimientos
pip install -r requerimientos.txt

```

## Configurar la Base de datos Posgres ⚙️
- Modificar el archivo settings.py 
- Reemplazar datos por los que tenga configurado en la base de datos
```bash
# Primero crear la base de datos y luego cambiar los datos en el archivo settings.py

DATABASES = {
     'default': {
         'ENGINE': 'django.db.backends.postgresql',
         'NAME': 'blog',
         'USER': 'postgres',
         'PASSWORD': '123456',
         'HOST': 'localhost',
         'PORT': '5432',
     }
 }

```

### Crear Migraciones y Luego migrar a la base de datos 🔩

```
python manage.py makemigrations
python manage.py migrate
```
##  Ejecutar script para configuracion inicial🚀
```bash
# Creacion de grupos, categorias y usuario administrador para acceder al sistema
python manage.py runscript script_inicial
# Luego acceder al sistema utilice estas credenciales
usuario: admin
contraseña: admin12345

```
##  Despliegue 🚀

```
Python manage.py runserver 
```


## Construido con 🛠️

* [Django](https://docs.djangoproject.com/en/2.2/) -  El framework web usado
* [Django REST framework](https://www.django-rest-framework.org/) - Kit de herramientas para crear API web.
* [Bootstrap](https://getbootstrap.com/) - Framework usado para la interfaz
* [Git](https://getbootstrap.com/) - Controlador de Versiones



## Autores ✒️
* **Andrés Navarro** 

## Expresiones de Gratitud 🎁

* Muchas Gracias 🤓.
---
⌨️ con ❤️ por [AndresNavarro](https://github.com/andreesnavarroo) 😊
