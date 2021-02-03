
// Archivo para hacer las peticiones Http, para consumir la api

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})


// Get data
// obtenemos la data recibiendo la URl
async function get(url) {
    return await axios.get(url).then(result => {
        if(result.code ==! 1){
            // console.log(result.message)
        }else{
            return result.data
        }
    }).catch((err) => {console.log(err.response)})
}

// Post data
// recibimos la URl, la data y token
async function post(url, data, csrf_token){
    return  await axios.post(url, data, {headers: {"X-CSRFToken": csrf_token,'Content-Type': 'application/json'}}).then(result => {
        if(result.data.code == 2){
            Toast.fire({
                icon: 'warning',
                title: String(result.data.message)
            })
            return result
        }else if(result.data.code ==! 1){
            Toast.fire({
                icon: 'warning',
                title: "Ha ocurrido un error contacte con el administrador"
            })
            return result
        }else{
            Toast.fire({
                icon: 'success',
                title:  String(result.data.message)
            })
            // title: "Regitro Exitoso!"
            return result.data
        }
    }).catch((err) => {
        console.log(err)
        Toast.fire({
            icon: 'error',
            title: String(err)
        })
        
    })
}

// Post data imagen
async function post_imagen(url, data, csrf_token){
    return  await axios.post(url, data, {headers: {"X-CSRFToken": csrf_token,'Content-Type': 'multipart/form-data'}}).then(result => {
        if(result.data.code == 2){
            Toast.fire({
                icon: 'warning',
                title: String(result.data.message)
            })
            return result
        }else if(result.data.code ==! 1){
            Toast.fire({
                icon: 'warning',
                title: "Ha ocurrido un error contacte con el administrador"
            })
            return result
        }else{
            Toast.fire({
                icon: 'success',
                title:  String(result.data.message)
            })
            // title: "Regitro Exitoso!"
            return result.data
        }
    }).catch((err) => {
        console.log(err)
        Toast.fire({
            icon: 'error',
            title: String(err)
        })

    })
}



// Put data
async function put(url, data, csrf_token){
    return  await axios.put(url, data, {headers: {"X-CSRFToken": csrf_token,'Content-Type': 'application/json' }}).then(result => {
        if(result.data.code == 2){
            Toast.fire({
                icon: 'warning',
                title: String(result.data.message)
            })
        }else if(result.data.code ==! 1){
            Toast.fire({
                icon: 'warning',
                title: "Ha ocurrido un error contacte con el administrador"
            })
        }else{
            Toast.fire({
                icon: 'success',
                title:  String(result.data.message)
            })
            // title: "Regitro Exitoso!"
            return result.data
        }
    }).catch((err) => {
        Toast.fire({
            icon: 'error',
            title: String(err)
        })
    })
}

// Delete 
async function deleted(url, csrf_token){
    return  await axios.delete(url, {headers: {"X-CSRFToken": csrf_token,'Content-Type': 'application/json' }}).then(result => {
        if(result.data.code == 2){
            Toast.fire({
                icon: 'warning',
                title: String(result.data.message)
            })
        }else if(result.data.code ==! 1){
            Toast.fire({
                icon: 'warning',
                title: "Ha ocurrido un error contacte con el administrador"
            })
        }else{
            Toast.fire({
                icon: 'success',
                title:  String(result.data.message)
            })
            // title: "Regitro Exitoso!"
            return result.data
        }
    }).catch((err) => {
        Toast.fire({
            icon: 'error',
            title: String(err)
        })
    })
}



// recibimos la URl, la data y token
async function post1(url, data, ){
    return  await axios.post(url, data, {headers: {'Content-Type': 'application/json'}}).then(result => {
        if(result.data.code == 2){
            Toast.fire({
                icon: 'warning',
                title: String(result.data.message)
            })
            return result
        }else if(result.data.code ==! 1){
            Toast.fire({
                icon: 'warning',
                title: "Ha ocurrido un error contacte con el administrador"
            })
            return result
        }else{
            Toast.fire({
                icon: 'success',
                title:  String(result.data.message)
            })
            // title: "Regitro Exitoso!"
            return result.data
        }
    }).catch((err) => {
        console.log(err)
        Toast.fire({
            icon: 'error',
            title: String(err)
        })
        
    })
}
