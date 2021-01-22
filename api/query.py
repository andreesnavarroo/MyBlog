from django.db import models
from model_utils import Choices


# Filtro Categorias de blogs
def filtro_categoria(queryset, **kwargs):
    ORDER_COLUMN = Choices(
        ('0', 'id'),
        ('1', 'nombre'),
        ('2', 'estado'),
    )

    if 'draw' in kwargs:
        draw = int(kwargs.get('draw', None)[0])
    else:
        draw = 0

    if 'length' in kwargs:
        length = int(kwargs.get('length', None)[0])
    else:
        length = queryset.count()

    if 'start' in kwargs:
        start = int(kwargs.get('start', None)[0])
    else:
        start = 0

    if 'search[value]' in kwargs:
        search_value = kwargs.get('search[value]', None)[0]
    elif 'search' in kwargs:
        search_value = kwargs.get('search', None)[0]
    else:
        search_value = ''

    if 'order[0][column]' in kwargs:
        order_column = kwargs.get('order[0][column]', None)[0]
    else:
        order_column = '0'

    if 'order[0][dir]' in kwargs:
        order = kwargs.get('order[0][dir]', None)[0]
    else:
        order = 'asc'

    order_column = ORDER_COLUMN[order_column]

    # # django orm '-' -> desc
    if order == 'desc':
        order_column = '-' + order_column

    total = queryset.count()

    if search_value:
        queryset = queryset.filter(models.Q(id__icontains=search_value) |
                                   models.Q(nombre__icontains=search_value) |
                                   models.Q(estado__icontains=search_value))

    count = queryset.count()
    queryset = queryset.order_by(order_column)[start:start + length]
    return {
        'items': queryset,
        'count': count,
        'total': total,
        'draw': draw
    }