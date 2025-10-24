// Reto 6 — Contacto: validación básica y SweetAlert de confirmación

const frm = document.getElementById('frmContacto');
const btnLimpiar = document.getElementById('btnLimpiar');

function limpiarErrores() {
  ['nombre','correo','telefono','motivo','mensaje'].forEach(id=>{
    const el = document.getElementById(id);
    if (el) el.classList.remove('error');
  });
}

function esEmailValido(email) {
  // Regex simple para formato de correo
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

frm.addEventListener('submit', (e)=>{
  e.preventDefault();
  limpiarErrores();

  const nombre  = document.getElementById('nombre').value.trim();
  const correo  = document.getElementById('correo').value.trim();
  const telefono= document.getElementById('telefono').value.trim(); // opcional
  const motivo  = document.getElementById('motivo').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const acepto  = document.getElementById('acepto').checked;

  let errores = [];

  if (!nombre){ errores.push('El nombre es obligatorio.'); document.getElementById('nombre').classList.add('error'); }
  if (!correo){ errores.push('El correo es obligatorio.'); document.getElementById('correo').classList.add('error'); }
  if (correo && !esEmailValido(correo)){ errores.push('El correo no tiene un formato válido.'); document.getElementById('correo').classList.add('error'); }
  if (!motivo){ errores.push('Selecciona el motivo.'); document.getElementById('motivo').classList.add('error'); }
  if (!mensaje){ errores.push('El mensaje es obligatorio.'); document.getElementById('mensaje').classList.add('error'); }

  // teléfono es opcional, pero si lo escribe, validamos básico
  if (telefono && !/^[0-9\-\s()+]{7,15}$/.test(telefono)) {
    errores.push('El teléfono contiene caracteres no válidos.');
    document.getElementById('telefono').classList.add('error');
  }

  if (!acepto){
    errores.push('Debes aceptar la política de privacidad.');
  }

  if (errores.length > 0){
    Swal.fire({
      icon:'warning',
      title:'Verifica los datos',
      html: '<ul style="text-align:left; margin:0; padding-left:1.1rem;">' +
            errores.map(e=>`<li>${e}</li>`).join('') + '</ul>'
    });
    return;
  }

  // Si pasa validación, mostramos confirmación
  Swal.fire({
    icon:'success',
    title:'Mensaje enviado',
    html:`<p>¡Gracias, ${nombre}!</p>
          <p>Hemos recibido tu solicitud por <b>${motivo}</b> y te contactaremos al correo <b>${correo}</b>.</p>`,
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#0d6efd'
  }).then(()=>{
    frm.reset();
  });

  // Si en algún momento quieres “mailto” directo:
  /*
  const asunto = encodeURIComponent('Consulta desde CleanExperts');
  const cuerpo = encodeURIComponent(
    `Nombre: ${nombre}\nCorreo: ${correo}\nTeléfono: ${telefono || 'N/A'}\nMotivo: ${motivo}\n\nMensaje:\n${mensaje}`
  );
  window.location.href = `mailto:contacto@cleanexperts.com?subject=${asunto}&body=${cuerpo}`;
  */
});

btnLimpiar.addEventListener('click', ()=>{
  frm.reset();
  limpiarErrores();
});
