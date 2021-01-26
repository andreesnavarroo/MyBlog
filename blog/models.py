from django.db import models
# Lib seguimiento de los cambios en los modelos
from simple_history.models import HistoricalRecords

from usuarios.models import Autor

class BaseModel(models.Model):
    """ BaseModel Funciona como una clase base abstracta
    en la que los otros  modelos del proyecto heredarán los atributos de esta
    clase, atributos:
        + fecha_creacion (DateTime):almacena la fecha y hora en que se creó el objeto.
        + fecha_modificacion (DateTime): almacena la última fecha y hora en que se modificó el objeto.
        + fecha_eliminacion (DateTime): almacena la última fecha y hora en que se eliminó el objeto.
        + estado (Bool): representa el estado
    """

    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
        help_text='Fecha y hora en la que se creó el objeto.'
    )
    fecha_modificacion = models.DateTimeField(
        auto_now=True,
        null=True,
        help_text='Fecha y hora en la que se modificó por última vez el objeto.'
    )

    fecha_eliminacion = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Fecha y hora en la que se eliminó el objeto.'
    )

    estado = models.BooleanField(default=True)

    class Meta:
        """Meta option."""

        abstract = True

        get_latest_by = 'fecha_creacion'
        ordering = ['-fecha_creacion', '-fecha_modificacion']


# Modelo Categorias
class Categoria(BaseModel):
    nombre = models.CharField(
        'Nombre de la Categoría', 
        max_length = 100, 
        unique = True
    )
    historical = HistoricalRecords()

    @property
    def _history_user(self):
        return self.changed_by

    @_history_user.setter
    def _history_user(self, value):
        self.changed_by = value    
            

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

    def __str__(self):
        return self.nombre


# Modelo Post
class Post(BaseModel):    
    autor = models.ForeignKey(Autor, related_name = 'autor_post',
            on_delete = models.CASCADE, null=False, blank = False)      
    categoria = models.ForeignKey(Categoria, on_delete = models.CASCADE, related_name="categoria_post")
    titulo = models.CharField(
        'Titulo del post',
        unique=True,
        max_length=200,
        blank=False, 
        null=False
    )
    descripcion = models.CharField(
        'Descipción del post',
        max_length=500,
        blank=False,
        null=False
    )
    imagen = models.ImageField(
        'imagen del post',
        upload_to='blog/images/', 
        default = 'sinimagen.jpg',
        blank=True, 
        null=True
    )
    contenido = models.TextField('Contenido')
    fecha_publicacion = models.DateField('fecha publicacion del post')
    fecha_desactiva = models.DateField('fecha desactiva post')
    publicado = models.BooleanField(help_text="Poner en True cuando el post este publicado", default=False)
    historical = HistoricalRecords()

    @property
    def _history_user(self):
        return self.changed_by

    @_history_user.setter
    def _history_user(self, value):
        self.changed_by = value

    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

    def __str__(self):
        return "Id: {} | Titulo: {}".format(self.pk, self.titulo)     

  
    @property
    def like_cantidad(self):
        """
            Se cuentan la cantidad de like por Post
        """
        return self.post_like.count()

    @property
    def comentarios_cantidad(self):
        """
            Se cuentan la cantidad de Comentarios por Post
        """
        return self.post_comentario.count()        

# Modelo Likes
class Like(BaseModel):

    post = models.ForeignKey(Post, related_name = 'post_like',
            on_delete = models.CASCADE, null=False, blank = False)
    autor = models.ForeignKey(Autor, related_name = 'autor_like',
            on_delete = models.CASCADE, null=False, blank = False)            
    historical = HistoricalRecords()

    @property
    def _history_user(self):
        return self.changed_by

    @_history_user.setter
    def _history_user(self, value):
        self.changed_by = value    

    class Meta:
        verbose_name = 'Like'
        verbose_name_plural = 'Likes'



# Modelo Comentarios
class Comentario(BaseModel):
    post = models.ForeignKey(Post, related_name = 'post_comentario',
            on_delete = models.CASCADE, null=False, blank = False)    
    autor = models.ForeignKey(Autor, related_name = 'autor_comentario',
            on_delete = models.CASCADE, null=False, blank = False)      
    descripcion = models.TextField('Descripcion', null=False, blank = False)
            
    historical = HistoricalRecords()

    @property
    def _history_user(self):
        return self.changed_by

    @_history_user.setter
    def _history_user(self, value):
        self.changed_by = value    
                    

    class Meta:
        verbose_name = 'Comentario'
        verbose_name_plural = 'Comentarios'

    def __str__(self):
        return self.descripcion            