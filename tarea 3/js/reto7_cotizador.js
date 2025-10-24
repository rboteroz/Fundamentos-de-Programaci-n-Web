// Reto 7 — Cotizador: cálculo + SweetAlert + enviar por correo (mailto)

const frm = document.getElementById('frmCotiza');
const res = document.getElementById('resultado');
const btnLimpiar = document.getElementById('btnLimpiar');

// Tarifa por m² según tipo de servicio
function tarifaPorTipo(tipo){
  switch(tipo){
    case 'hogar':        return 1200;
    case 'oficina':      return 1400;
    case 'profunda':     return 1600;   // servicio de limpieza profunda por m²
    case 'alfombras':    return 1000;   // lavado por m² (orientativo)
    case 'desinfeccion': return 1100;   // desinfección por m² (orientativo)
    default:             return 0;
  }
}

function calcularResumen(tipo, m2, inten, extras){
  const tarifa = tarifaPorTipo(tipo);
  const mult = (inten === 'profunda') ? 1.3 : 1.0;
  const sub = tarifa * m2 * mult;

  const plus = (extras.ventanas ? sub*0.20 : 0)
             + (extras.tapiceria ? 15000 : 0)
             + (extras.desinf ? 10000 : 0);

  const iva = (sub + plus) * 0.13;
  const total = Math.round(sub + plus + iva);

  return { tipo, intensidad:inten, m2, sub, plus, iva, total };
}

function formatCRC(n){
  return `₡ ${Math.round(n).toLocaleString()}`;
}

function renderResultado(summary){
  // Pinta el resumen en la tarjeta
  res.classList.remove('animate__fadeInUp');
  res.innerHTML = `
    <h3>Resumen de la cotización</h3>
    <p class="muted">Estimación referencial. Sujeto a inspección y disponibilidad.</p>
    <ul class="quote-list">
      <li><b>Servicio:</b> ${summary.tipo}</li>
      <li><b>Intensidad:</b> ${summary.intensidad}</li>
      <li><b>Área:</b> ${summary.m2} m²</li>
      <li>Subtotal: ${formatCRC(summary.sub)}</li>
      <li>Extras: ${formatCRC(summary.plus)}</li>
      <li>IVA (13%): ${formatCRC(summary.iva)}</li>
      <li class="quote-total">Total: ${formatCRC(summary.total)}</li>
    </ul>
    <div style="margin-top:.8rem;">
      <button id="btnSend" class="btn btn--secondary">Enviar cotización por correo</button>
    </div>
  `;
  res.classList.add('animate__fadeInUp');

  // SweetAlert emergente con el total
  Swal.fire({
    title: 'Cotización lista',
    html: `
      <p><b>Servicio:</b> ${summary.tipo}</p>
      <p><b>Intensidad:</b> ${summary.intensidad}</p>
      <p><b>Área:</b> ${summary.m2} m²</p>
      <p style="margin-top:.6rem;"><b>Total:</b> ${formatCRC(summary.total)}</p>
    `,
    icon: 'success',
    confirmButtonColor: '#0d6efd'
  });

  // Botón para enviar por correo (mailto)
  document.getElementById('btnSend').addEventListener('click', ()=> pedirCorreoYEnviar(summary));
}

function pedirCorreoYEnviar(summary){
  // Si quieres forzar login antes de enviar, revisa localStorage:
  // const logged = localStorage.getItem('isLoggedIn') === 'true';
  // if(!logged){ Swal.fire({icon:'info', title:'Inicia sesión', text:'Debes iniciar sesión para enviar la cotización.'})
  //                .then(()=> window.location.href = 'reto2_login.html'); return; }

  Swal.fire({
    title: '¿A qué correo enviamos?',
    input: 'email',
    inputPlaceholder: 'tu@correo.com',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    confirmButtonColor:'#0d6efd',
    preConfirm: (email)=>{
      if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        Swal.showValidationMessage('Ingresa un correo válido');
        return false;
      }
      return email;
    }
  }).then(r=>{
    if(!r.isConfirmed) return;
    const email = r.value;

    const body =
`CLEANEXPERTS - COTIZACIÓN

Servicio: ${summary.tipo}
Intensidad: ${summary.intensidad}
Área: ${summary.m2} m²

Subtotal: ${formatCRC(summary.sub)}
Extras:   ${formatCRC(summary.plus)}
IVA:      ${formatCRC(summary.iva)}
TOTAL:    ${formatCRC(summary.total)}

* Estimación referencial; sujeta a inspección y disponibilidad.`;

    const subject = 'Cotización CleanExperts';
    const url = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  });
}

function limpiarErrores(){
  ['tipo','metros','intensidad'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.classList.remove('error');
  });
}

// SUBMIT
frm.addEventListener('submit', (e)=>{
  e.preventDefault();
  limpiarErrores();

  const tipo = document.getElementById('tipo').value;
  const m2   = parseInt(document.getElementById('metros').value,10);
  const inten= document.getElementById('intensidad').value;

  let errores = [];
  if(!tipo){ errores.push('Seleccione el tipo de servicio.'); document.getElementById('tipo').classList.add('error'); }
  if(!inten){ errores.push('Seleccione la intensidad.'); document.getElementById('intensidad').classList.add('error'); }
  if(isNaN(m2) || m2 <= 0){ errores.push('Ingrese los m² (número mayor a 0).'); document.getElementById('metros').classList.add('error'); }

  if(errores.length > 0){
    Swal.fire({
      icon:'warning',
      title:'Verifique los datos',
      html:'<ul style="text-align:left; margin:0; padding-left:1.1rem;">' + errores.map(e=>`<li>${e}</li>`).join('') + '</ul>'
    });
    return;
  }

  const extras = {
    ventanas: document.getElementById('exVentanas').checked,
    tapiceria: document.getElementById('exTapiceria').checked,
    desinf: document.getElementById('exDesinfeccion').checked
  };

  const s = calcularResumen(tipo, m2, inten, extras);
  renderResultado(s);
});

// LIMPIAR
btnLimpiar.addEventListener('click', ()=>{
  frm.reset();
  res.innerHTML = '';
  limpiarErrores();
});
