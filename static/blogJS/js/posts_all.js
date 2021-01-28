
// Obtener todos los posts (PAGINA DE INICIO)
get('/api-posts-all').then(result => {
    var jsonData = JSON.stringify(result.data);
      $.each(JSON.parse(jsonData), function (id, obj) {
             $("#card_post").append(
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
                  "</div>"+
                "</div>"+
              "</div> "
              
        )
      });
  });
  