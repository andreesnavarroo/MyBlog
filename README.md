
# Blog



### Dependencia 📋
```
Python 3 Django

```

### Instalación 🔧

```bash
# Crear entorno virtual y activar
pip install virtualenv MiEntorno
:\>c:\ruta\al\entorno\virtual\scripts\activate.bat
# Instalar los requerimientos
pip install -r requerimientos.txt

```

## Configurar la Base de datos Posgres ⚙️
- Modificar el archivo settings.py 
- Reemplazar datos por los que tenga configurado en la base de datos
```
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


##  Delpliegue 🚀

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
