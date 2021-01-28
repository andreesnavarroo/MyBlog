var id = null
var token = JSON.parse(localStorage.getItem("token"));

 // Recibimos el id del post para el like del post
data = {
    'pk_post':id_post
  }
  // Funcion Click para agregar o quitar like Post
  $('#like_post').click(function(){
    console.log("escuchando")
    post('/api-like-posts/', data, token).then(result => {
      
    });
  })
  
  // Funcion para guardar comentario
  function guardarComentario() {
    // Obtenemos la data para enviar
    var data = {
      "descripcion": $('#descripcion').val(),
    }
    // Post crear Comentario
    if(id==null){
      console.log(id)
      post('/api-comentario/'+id_post+'/', data, token).then(result => {
        window.location.reload(); 
      });    
    }else{
      // Obtenemos la data del Modal Editar
      var data = {
        "descripcion": $('#descripcion_modal').val(),
      }      
      // Editamos el comentario
      put('/api-comentario/editar/'+id+'/', data, token).then(result => {
        id=null
        window.location.reload(); 
      });
    }
  }
  
  // Modal Editar comentario
  function EditarComentario(id){
    // Traemos los datos del comentario
    this.id= id
    $('#descripcion_modal').removeClass("is-valid")
    $('#descripcion_modal').removeClass("is-invalid")
      get('/api-comentario/editar/'+ id).then(result => {
        var objeto = result.data    
        document.getElementById('descripcion_modal').value = objeto.descripcion
        document.getElementById('titleModal').innerText = 'Editar Comentario';
        document.getElementById('subtitle').innerText = ' En esta sección puedes Editar Comentarios';
        $("#ModalEditarComentario").modal('show');
    })    
  }  


// Validamos el formulario (editar) y ejecutamos la funcion guardarComentario
function validEditComentario(){
  // Si la descripcion es igual a vacio
  // Entonces muestra que es invalido
  if ($('#descripcion_modal').val() == ""){
      $('#descripcion_modal').removeClass("is-valid")
      $('#descripcion_modal').addClass("is-invalid")
  }
  // si cumple las condiciones se llama funcion para guardar comentario
  if($('#descripcion_modal').val() != ""){
    guardarComentario()
  }
}  



// Validamos el formulario y ejecutamos la funcion guardarComentario
function validComentario(){
  // Si la descripcion es igual a vacio
  // Entonces muestra que es invalido
  if ($('#descripcion').val() == ""){
      $('#descripcion').removeClass("is-valid")
      $('#descripcion').addClass("is-invalid")
  }
  // si cumple las condiciones se llama funcion para guardar comentario
  if($('#descripcion').val() != ""){
    guardarComentario()
  }
}  

// Eliminar Comenatario
function EliminarComentario(id){
        Swal.fire({
          title: '¿Eliminar  comentario definitivamente?',
          text: "¡Eliminar comentario!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3AC162',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar!'
        }).then((result) => {
          if (result.value) { 
            deleted('/api-comentario/editar/'+id+'/',token).then(result => {
                  Swal.fire(
                      '¡Eliminado!',
                      'Comentario fue Eliminadi correctamente.',
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
              console.log("no entra")
          }
        })  
}
  // Eliminar comentario
    
      //   console.log("escuchando")
      //   Swal.fire({
      //     title: '¿Estas seguro que deseas eliminar este registro?',
      //     text: "¡Estos cambios no se pueden revertir!",
      //     icon: 'warning',
      //     showCancelButton: true,
      //     confirmButtonColor: '#3085d6',
      //     cancelButtonColor: '#d33',
      //     confirmButtonText: 'Si, eliminar!'
      //   }).then((result) => {
      //     if (result.value) { 
      //         put('tarifas/'+id, data,token).then(result => {
      //             Swal.fire(
      //                 '¡Eliminado!',
      //                 'Comentario fue eleminado correctamente.',
      //                 'success'
      //             )
      //         }).catch(function (error) {
      //             console.log(error)
      //             Swal.fire(
      //                 '¡Error!',
      //                 'Comentario no se pudo eliminar, consulte con el administrador',
      //                 'warning'
      //             )
      //         })
  
      //     }else{
      //         console.log("no entra")
      //     }
      //   })
      // })    
  
