// common.js – utilidades globales para todos los retos

// Muestra un SweetAlert de error con un solo parámetro (mensaje)
function alertaError(msg){
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: msg,
    confirmButtonColor: '#0275d8'
  });
}

// Devuelve true si la cadena está vacía o sólo contiene espacios
function campoVacio(valor){
  return valor.trim() === '';
}
