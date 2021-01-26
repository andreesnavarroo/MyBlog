var id = null
var tabla = null

var token = JSON.parse(localStorage.getItem("token"));

// Le pasamos los datos a la tabla
this.tabla = $('#categorias-tabla').DataTable({
    dom:"ftpi",
    "language": {
        "url": "//cdn.datatables.net/plug-ins/1.10.20/i18n/Spanish.json"
    },
    "autoWidth": false,
    "processing": true,
    "responsive": true,
    "serverSide": true,
    "select": true,
    "ajax": "/api-categorias",
    "columns": [
        {"data": "nombre", "searchable": false, "orderable":false},
        {"data": "fecha_creacion", "searchable": false, "orderable":false},
        {"data": "estado", "searchable": true, "orderable":true},
    ],
    // Personalizamos las columnas
    columnDefs:[

    {"targets":3,
    "className": "text-center",
    "data":"id",
    "render": function(data,type,full,meta){
        var buttons = '<a onclick="modalUpdate('+data+')"  class="bx bx-edit bx-sm"></a> ';
        return buttons;
    }
  },{"targets":2,
    "className": "text-center",
    "data":"estado",
    "render": function(data,type,full,meta){
        if(data==true){
            return "<span class='badge badge-success font-weight-bold'>ACTIVO</span>"
        }
        else{
            return "<span class='badge badge-danger font-weight-bold'>INACTIVO</span>"
        }
    }
    }]
}).columns.adjust();


// Modal Crear Categorias
function modalCreate() {
    id=null
    document.getElementById('nombre').value= ""
    document.getElementById('statusSelect').value = true
    document.getElementById('titleModal').innerText = 'Crear Categoria';
    document.getElementById('subtitle').innerText = ' En esta sección puedes crear nuevas categorias';
    $("#ModalCreateOrUpdate").modal('show')
}

//  Modal para Editar Categorias
function modalUpdate(id){
    this.id= id
    // Removemos las clases
    $('#nombre').removeClass("is-valid")
    $('#nombre').removeClass("is-invalid")
    $('#statusSelect').removeClass("is-valid")
    $('#statusSelect').removeClass("is-invalid")
    // Obtenemos la categoria por el ID y mostramos sus datos
    get('/api-categorias/'+ id).then(result => {
        var objeto = result.data
        document.getElementById('nombre').value= objeto.nombre
        document.getElementById('statusSelect').value = objeto.estado
        document.getElementById('titleModal').innerText = 'Actualizar Categoria';
        document.getElementById('subtitle').innerText = ' En esta sección puedes Actualizar Categias';
        $("#ModalCreateOrUpdate").modal('show');
    })
}

// Validamos el formulario y ejecutamos la funcion CrearOActualizar
function validForm(){
    // Si el nombre es igual a vacio
    // Entonces muestra que es invalido
    if ($('#nombre').val() == ""){
        $('#nombre').removeClass("is-valid")
        $('#nombre').addClass("is-invalid")
    }else{
        $('#nombre').removeClass("is-invalid")
        $('#nombre').addClass("is-valid")
    }

    if ($('#statusSelect').val() == 0){
        $('#statusSelect').removeClass("is-valid")
        $('#statusSelect').addClass("is-invalid")
    }else{
        $('#statusSelect').removeClass("is-invalid")
        $('#statusSelect').addClass("is-valid")
    }
    // si cunple las condiciones se llama crea o actualiza el objeto
    if($('#nombre').val() != ""  && $('#statusSelect').val() !=0){
        CrearOActualizar()
    }
}

// Funcion para  crear o actualizar Categoria
function CrearOActualizar(){
    // Obtenemos la data para enviar
    var data = {
        "nombre": $('#nombre').val(),
        "estado": $('#statusSelect').val(),
    }
    if(id==null){
        // Peticion Post categoria
        post('/api-categorias/',data,token).then(result => {
            this.tabla.ajax.reload()
            $("#ModalCreateOrUpdate").modal('hide')
        })
    }else{
        // Peticion Put
        put('/api-categorias/'+id+'/', data,token).then(result => {
            this.tabla.ajax.reload()
            $("#ModalCreateOrUpdate").modal('hide')
            id=null
        })
    }
}