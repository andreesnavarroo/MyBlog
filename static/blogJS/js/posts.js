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

