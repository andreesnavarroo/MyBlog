var id = null
var token = JSON.parse(localStorage.getItem("token"));


get('/api-posts/'+id_post).then(result => {
        obj = result.data
           $("#detall_blog").append(
              "<div class='row'>"+
              "<div class='col-lg-8'>"+
                "<img src='"+obj.imagen+"' class='img-fluid' alt=''>"+
               " <h3 id='p_titulo'>"+obj.titulo+"</h3>"+
                // "<h4><a class='post-cata'>{{post.categoria}}</a></h4>"+
                "<h4>"+obj.categorias.map(e=> "<h4>"+e.nombre+"</h4>")+"</h4>"+   
                "<div class='d-flex justify-content-between align-items-center mb-3'>"+
                "<h4 style='background:darkgray; border-radius:10px'>"+obj.tags+"</h4>"+             
                "</div>"+                      
                "<div class='trainer-rank d-flex align-items-center'>"+
                  "<div>"+
                    "<h4 id='like_post' class='post-like like'><i id='i_like' class='bx bx-heart'>&nbsp; "+obj.cantidad_like+" Likes</i></h4>"+
                  "</div>"+
                 " &nbsp;&nbsp;"+
                  "<h4 class='post-like'><i class='bx bx-comment'>&nbsp;"+obj.cantidad_comentarios+" Comentarios</i></h4>"+
                "</div>"+
                "<p>"+obj.contenido+"</p>"+
              "</div>"+
              "<div class='col-lg-4'>"+
              "</div>"+
           " </div>"
           )
    });

 // Recibimos el id del post para el like del post
data = {
    'pk_post':id_post
  }
   // Funcion Click para agregar o quitar like Post
  $('#detall_blog').on( 'click', '.like', function (event) {
    post('/api-like-posts/', data, token).then(result => {
      if (result.message == 'Like asignado'){
        $('#like_post').html("  <i id='i_like'  style='background-color: red;' class='bx bx-heart'>&nbsp; "+result.post.cantidad_like+" Likes</i>")
      }else{
        $('#like_post').html("  <i id='i_like'  class='bx bx-heart'>&nbsp; "+result.post.cantidad_like+" Likes</i>")
      }
    });    
  });      
 
  // Funcion para guardar comentario
  function guardarComentario() {
    // Obtenemos la data para enviar
    var data = {
      "descripcion": $('#descripcion').val(),
    }
    // Post crear Comentario
    if(id==null){
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
                      'Comentario fue Eliminado correctamente.',
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
}
 
  
