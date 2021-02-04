
  // Inicia con todos los datos
  urlBusqueda = '/api-posts-all/'
  listar(urlBusqueda)

// Funcion listar recibre como parametro la url
function listar(url){
  eliminar()
  get(url).then(result => {
    if (result.data.length == 0){
      $("#card_post").append(
          "<p style='background-color: #d43c3c; color:white'>"+'No se han encontrado posts! '+"</p>"
      )
  }else{    
    
    var jsonData = JSON.stringify(result.data);
      $.each(JSON.parse(jsonData), function (id, obj) {
             $("#card_post").append(
                "<div class='col-lg-4 col-md-6 d-flex align-items-stretch'>"+
                "<div class='course-item'>"+
                    "<img  src='"+obj.imagen+"' class='img-fluid' alt='...'>"+
                  "<div class='course-content'>"+
                    "<div class='d-flex justify-content-between align-items-center mb-3'>"+
                    "<a>"+obj.categorias.map(e=> "<h4>"+e.nombre+"</h4>")+"</a>"+               
                      "<i class='bx bx-calendar'>" +obj.fecha_publicacion+"</i>"+
                    "</div>"+
                    "<div class='d-flex justify-content-between align-items-center mb-3'>"+
                    "<h4 style='background:darkgray; border-radius:41px'>"+obj.tags+"</h4>"+             
                    "</div>"+                    
                    "<h3><a href='/detalle_post/"+obj.id+"'>"+obj.titulo+"</a></h3>"+
                    "<p >"+obj.descripcion+"</p>"+
                    "<div class='trainer d-flex justify-content-between align-items-center'>"+
                      "<div class='trainer-profile d-flex align-items-center'>"+
                       (
                        obj.autor.imagen != null ?
                        "<img src='"+obj.autor.imagen+"' class='img-fluid' alt='...'>":
                        "<img src='static/img/sin_foto.png' %}' class='img-fluid' alt='...'>"
                        )+
                        
                        "<span>"+obj.autor.username+"</span>"+
                      "</div>"+
                      "<div class='trainer-rank d-flex align-items-center'>"+
                        "<i class='bx bx-heart'></i>&nbsp;"+obj.cantidad_like+""+
                        "&nbsp;&nbsp;"+
                        "<i class='bx bx-comment'></i>&nbsp;"+obj.cantidad_comentarios+""+
                      "</div>"+
                    "</div>"+
                  "</div>"+
                "</div>"
             
              
        )
      });
    }
  });
}
  // si se le da click en buscar, trae la ruta con los parametros de la busqueda
function Buscar(){
    var busqueda = $("#buscador").val()
    urlBusqueda = '/api-posts-all/?search='+busqueda
    listar(urlBusqueda)
    // window.location.reload(); 
}
// eliminar el contenido del div

function eliminar(){
  document.getElementById('card_post').innerHTML = ""
}
// valida q cuando el buscador este vacio traiga toda la info
// se le pasa la ruta q trae todos los posts
$("#buscador").on("keyup", function(){
  if( $("#buscador").val().length <= 0) {
    urlBusqueda = '/api-posts-all/'
    listar(urlBusqueda);
  }
});