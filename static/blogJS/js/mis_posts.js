id= null;
var token = JSON.parse(localStorage.getItem("token"));
$('#fecha_publ').datetimepicker({
    format: 'YYYY-MM-DD',
    date: moment().format("YYYY-MM-DD"),
    locale: 'es',
});

$('#fecha_fin').datetimepicker({
    format: 'YYYY-MM-DD',
    locale: 'es',
});
// Obtenemos los posts de el usuario actual y los listados en esta cards
get('/api-posts').then(result => {
    var jsonData = JSON.stringify(result.data);
      $.each(JSON.parse(jsonData), function (id, obj) {
             $("#card_mis_post").append(
                "<div class='col-lg-4 col-md-6 d-flex align-items-stretch'>"+
                "<div class='course-item'>"+
                    "<img  src='"+obj.imagen+"' class='img-fluid' alt='...'>"+
                  "<div class='course-content'>"+
                    "<div class='d-flex justify-content-between align-items-center mb-3'>"+
                      "<h4>"+obj.categoria.nombre+"</h4>"+
                      "<i class='bx bx-calendar'>" +obj.fecha_publicacion+"</i>"+
                    "</div>"+
                    "<h3><a href='/detalle_post/"+obj.id+"'>"+obj.titulo+"</a></h3>"+
                    "<p >"+obj.descripcion+"</p>"+
                    "<div class='trainer d-flex justify-content-between align-items-center'>"+
                      "<div class='trainer-profile d-flex align-items-center'>"+
                        "<img src='"+obj.autor.imagen+"' class='img-fluid' alt='...'>"+
                        "<span>"+obj.autor.username+"</span>"+
                      "</div>"+
                      "<div class='trainer-rank d-flex align-items-center'>"+
                        "<i class='bx bx-heart'></i>&nbsp;"+obj.cantidad_like+""+
                        "&nbsp;&nbsp;"+
                        "<i class='bx bx-comment'></i>&nbsp;"+obj.cantidad_comentarios+""+
                      "</div>"+
                    "</div>"+
                    "<div style='float: right;'>"+
                    "<a class='badge badge-warning text-white'> Editar</a>"+
                    "<a class='badge badge-danger'>Eliminar</a>"+
                  "</div>"+                 
                  "</div>"+
                "</div>"+
              "</div> "
              
        )
      });
  });


// Consumimos la api y insertamos los datos en las opciones de los Selects
get('/api-categorias').then(result => {
    var jsonData = JSON.stringify(result.data);
    $.each(JSON.parse(jsonData), function (id, obj) {
        $("#categoria").append('<option value="' + obj.id + '">' + obj.nombre + '</option>');
    });
});


// Inicializamos el Modal para hacer una creacion
function modalCreate() {
    id = null
    document.getElementById('titulo').value = ""
    document.getElementById('categoria').value = 0
    document.getElementById('descripcion').value = ""
    document.getElementById('contenido').value = ""
    document.getElementById('fecha_publ').value =  moment().format("YYYY-MM-DD"),
    document.getElementById('fecha_fin').value =  ""
    document.getElementById('imagen').value = ""
    document.getElementById('titleModal').innerText = 'Crear Post';
    document.getElementById('subtitle').innerText = ' En esta sección puedes crear nuevos Posts';
    $("#ModalCreateOrUpdate").modal('show')
}

function modalUpdate(id) {
    get('/api-posts/' + id).then(result => {
        var objeto = result.data
        console.log(objeto)
        document.getElementById("cantidad").disabled = true;
        document.getElementById('codigo').value = objeto.codigo
        document.getElementById('nombre').value = objeto.nombre
        document.getElementById('categoria').value = objeto.categoria.id
        document.getElementById('marca').value = objeto.marca ? objeto.marca.id : '0';
        document.getElementById('presentacion').value = objeto.presentacion ? objeto.presentacion.id : '0';
        document.getElementById('impuesto').value = objeto.impuesto ? objeto.impuesto.id : '0';
        document.getElementById('precio_compra').value = objeto.precio_compra
        document.getElementById('precio_venta').value = objeto.precio_venta
        document.getElementById('cantidad').value = objeto.cantidad
        document.getElementById('statusSelect').value = objeto.estado
        document.getElementById('titleModal').innerText = 'Actualizar Producto';
        document.getElementById('subtitle').innerText = ' En esta sección puedes Actualizar Productos';
        $("#ModalCreateOrUpdate").modal('show');
    })
}

// Funcion para  crear o actualizar el registro
function CrearOActualizar() {
    
    var data = new FormData();
    data.append('titulo', $('#titulo').val())
    data.append('categoriaID', $('#categoria').val())
    data.append('descripcion', $('#descripcion').val())
    data.append('contenido', $('#contenido').val())
    data.append('fecha_publicacion', $('#fecha_publ').val())
    data.append('fecha_desactiva', $('#fecha_fin').val())
    if ($('#imagen').val() != "") {
        data.append('imagen', $('#imagen')[0].files[0])
    }    
    if (id == null) {
        // funcion para crear
        post_imagen('/api-posts/', data, token).then(result => {
            //location.href = '/mis_posts'
            $("#ModalCreateOrUpdate").modal('hide')
        });
    } else {
        // Actualizar
        put('/api-posts/' + id + '/', data, token).then(result => {
            $("#ModalCreateOrUpdate").modal('hide')
            id = null
        })
    }

}

// Validamos el formulario y ejecutamos la funcion CrearOActualizar
function validForm() {
    // si el nombre es igual a vacio
    // entonces muestrame que es invalido
    if ($('#titulo').val() == "") {
        $('#titulo').removeClass("is-valid")
        $('#titulo').addClass("is-invalid")
    } else {
        $('#titulo').removeClass("is-invalid")
        $('#titulo').addClass("is-valid")
    }
    if ($('#descripcion').val() == "") {
        $('#descripcion').removeClass("is-valid")
        $('#descripcion').addClass("is-invalid")
    } else {
        $('#descripcion').removeClass("is-invalid")
        $('#descripcion').addClass("is-valid")
    }    
    if ($('#categoria').val() == 0) {
        $('#categoria').removeClass("is-valid")
        $('#categoria').addClass("is-invalid")
    } else {
        $('#categoria').removeClass("is-invalid")
        $('#categoria').addClass("is-valid")
    }
    if ($('#contenido').val() == "") {
        $('#contenido').removeClass("is-valid")
        $('#contenido').addClass("is-invalid")
    } else {
        $('#contenido').removeClass("is-invalid")
        $('#contenido').addClass("is-valid")
    }
    if ($('#fecha_publ').val() == "") {
        $('#fecha_publ').removeClass("is-valid")
        $('#fecha_publ').addClass("is-invalid")
    } else {
        $('#fecha_publ').removeClass("is-invalid")
        $('#fecha_publ').addClass("is-valid")
    }
    if ($('#fecha_fin').val() == "") {
        $('#fecha_fin').removeClass("is-valid")
        $('#fecha_fin').addClass("is-invalid")
    } else {
        $('#fecha_fin').removeClass("is-invalid")
        $('#fecha_fin').addClass("is-valid")
    }
    if ($('#titulo').val() != ""  && $('#categoria').val() != 0 && $('#descripcion').val() != "" && $('#contenido').val() != "" && $('#fecha_publ').val() != "" && $('#fecha_fin').val() >= "") {
        CrearOActualizar()
    }
}

