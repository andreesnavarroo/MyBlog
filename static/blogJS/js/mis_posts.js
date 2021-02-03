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
// get('/api-posts').then(result => {
//     var jsonData = JSON.stringify(result.data);
//     $.each(JSON.parse(jsonData), function (id, obj) {
//         obj.categorias.forEach(e=>{console.log(e.nombre)})
//     });
// });
// Obtenemos los posts de el usuario actual y los listados en esta cards
get('/api-posts').then(result => {
    if (result.data.length == 0){
        $("#card_mis_post").append(
            "<p style='background-color: #d43c3c; color:white'>"+'No se han encontrado posts, porfavor crear '+"</p>"
        )
    }else{
    var jsonData = JSON.stringify(result.data);
      $.each(JSON.parse(jsonData), function (id, obj) {
             $("#card_mis_post").append(
                "<div class='col-lg-4 col-md-6 d-flex align-items-stretch'>"+
                "<div class='course-item'>"+
                    "<img  src='"+obj.imagen+"' class='img-fluid' alt='...'>"+
                  "<div class='course-content'>"+
                    "<div class='d-flex justify-content-between align-items-center mb-3'>"+
                      "<la>"+obj.categorias.map(e=> "<h4>"+e.nombre+"</h4>")+"</la>"+               
                      "<i class='bx bx-calendar'>" +obj.fecha_publicacion+"</i>"+
                    "</div>"+
                    "<div class='d-flex justify-content-between align-items-center mb-3'>"+
                    "<h4 style='background:darkgray; border-radius:41px'>"+obj.tags+"</h4>"+             
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
                    "<a class='badge badge-warning text-white updatemodal' data-update="+ obj.id +"> Editar</a>"+
                    "<a class='badge badge-danger delete' data-delete="+ obj.id +">Eliminar</a>"+
                  "</div>"+                 
                  "</div>"+
                "</div>"+
              "</div> "
              
        )
      });
    }  
  });


// Consumimos la api y insertamos los datos en las opciones de los Selects
get('/api-categorias').then(result => {
    var jsonData = JSON.stringify(result.data);
    $.each(JSON.parse(jsonData), function (id, obj) {
        $("#categorias").append('<option value="' + obj.id + '">' + obj.nombre + '</option>');
    });
});





// Inicializamos el Modal para hacer una creacion
function modalCreate() {
    id = null
    // limpiamos el div q contiene la imagen
    $("#image").empty();
    $("#imagen").val('');
    document.getElementById('titulo').value = ""
    document.getElementById('categorias').value = ""
    document.getElementById('descripcion').value = ""
    document.getElementById('tags').value = ""
    document.getElementById('contenido').value = ""
    document.getElementById('fecha_publ').value =  moment().format("YYYY-MM-DD"),
    document.getElementById('fecha_fin').value =  ""
    document.getElementById('imagen').value = ""
    document.getElementById('titleModal').innerText = 'Crear Post';
    document.getElementById('subtitle').innerText = ' En esta sección puedes crear nuevos Posts';
    $("#ModalCreateOrUpdate").modal('show')
}


// escuchar evento en la tarjeta para crear un alojamiento
$('#card_mis_post').on( 'click', '.updatemodal', function (event) {
  
    id = this.getAttribute("data-update");
    get('/api-posts/' + id).then(result => {
        var objeto = result.data
        $("#image").add();
        $("#imagen").val('');
        $("#categorias").val(objeto.categorias.map(e=>(e.id)));
        $("#image").html('<img src="' + objeto.imagen + '" alt="imagen" style="width: 40px; height: 40px;">')
        document.getElementById('titulo').value = objeto.titulo
        document.getElementById('descripcion').value = objeto.descripcion
        // document.getElementById('categorias').value = objeto.categorias.map(e=> console.log(e.id))
        document.getElementById('tags').value = objeto.tags
        document.getElementById('contenido').value = objeto.contenido
        document.getElementById('fecha_publ').value =  objeto.fecha_publicacion
        document.getElementById('fecha_fin').value =   objeto.fecha_desactiva
        document.getElementById('titleModal').innerText = 'Editar Post';
        document.getElementById('subtitle').innerText = ' En esta sección puedes Editar Posts';
        $("#ModalCreateOrUpdate").modal('show');
    })
  

 });



// Funcion para  crear o actualizar el registro
function CrearOActualizar() {
     
     // convertirnos la cadena de texto a un array 
    tags =  $('#tags').val(),
    array_tags = tags.split(',')
    // Obtenemos el array
    array_categoria = $('#categorias').val()
    var data = new FormData();
    data.append('titulo', $('#titulo').val())
    data.append('categorias',  String(array_categoria));
    data.append('descripcion', $('#descripcion').val())
    data.append('tags', String(array_tags));
    data.append('contenido', $('#contenido').val())
    data.append('fecha_publicacion', $('#fecha_publ').val())
    data.append('fecha_desactiva', $('#fecha_fin').val())
    if ($('#imagen').val() != "") {
        data.append('imagen', $('#imagen')[0].files[0])
    }       
   
    if (id == null) {
        // Post para crear
        post('/api-posts/', data, token).then(result => {
            window.location.reload(); 
            $("#ModalCreateOrUpdate").modal('hide')
        });
    } else {
        // Actualizar
        put('/api-posts/' + id + '/', data, token).then(result => {
            $("#ModalCreateOrUpdate").modal('hide')
            id = null
            // window.location.reload(); 
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
    if ($('#categorias').val() == "") {
        $('#categorias').removeClass("is-valid")
        $('#categorias').addClass("is-invalid")
    } else {
        $('#categorias').removeClass("is-invalid")
        $('#categorias').addClass("is-valid")
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

// Eliminar Post
$('#card_mis_post').on( 'click', '.delete', function (event) {

    id = this.getAttribute("data-delete");
    Swal.fire({
      title: '¿Eliminar  Post definitivamente)',
      text: "¡Eliminar Post Con ID " +id,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3AC162',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar!'
    }).then((result) => {
      if (result.value) { 
        deleted('/api-posts/'+id+'/',token).then(result => {
              Swal.fire(
                  '¡Eliminado!',
                  'Post fue Eliminado correctamente.',
                  'success'
              )
            window.location.reload();
          }).catch(function (error) {
              console.log(error)
              Swal.fire(
                  '¡Error!',
                  'Comentario no se pudo eliminar, consulte con el administrador',
                  'warning'
              )
          })

      }else{
          
      }
    })  
});