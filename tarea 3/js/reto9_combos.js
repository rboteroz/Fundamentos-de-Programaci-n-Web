// Reto 9 — Combos dinámicos: Provincia -> Cantón -> Servicio
// Usa DOM + objetos + eventos change + SweetAlert (validación)

const $prov = document.getElementById('provincia');
const $cant = document.getElementById('canton');
const $serv = document.getElementById('servicio');
const $frm  = document.getElementById('frmCombos');
const $out  = document.getElementById('salida');
const $btnLimpiar = document.getElementById('btnLimpiar');

// Dataset: provincias -> cantones -> servicios
const DATA = {
  "San José": {
    "Escazú":        ["Limpieza residencial", "Limpieza profunda", "Ventanas y vidrios"],
    "Santa Ana":     ["Limpieza de oficinas", "Desinfección especial", "Lavado de alfombras"],
    "Desamparados":  ["Limpieza residencial", "Tapicería", "Ventanas y vidrios"]
  },
  "Heredia": {
    "Heredia Centro": ["Limpieza de oficinas", "Limpieza profunda", "Desinfección especial"],
    "Belén":          ["Limpieza residencial", "Lavado de alfombras", "Ventanas y vidrios"],
    "Santo Domingo":  ["Limpieza residencial", "Tapicería", "Desinfección especial"]
  },
  "Alajuela": {
    "Alajuela Centro": ["Limpieza residencial", "Limpieza profunda", "Lavado de alfombras"],
    "Grecia":          ["Limpieza de oficinas", "Desinfección especial", "Ventanas y vidrios"],
    "San Ramón":       ["Limpieza residencial", "Tapicería", "Limpieza profunda"]
  }
};

// Helpers
function clearSelect(sel, keepFirst=true){
  if(keepFirst){
    sel.length = 1; // deja sólo "Seleccione…"
  }else{
    sel.length = 0;
  }
}

function enable(sel, on=true){
  sel.disabled = !on;
  if(!on) sel.value = "";
}

function fillSelect(sel, items){
  clearSelect(sel);
  items.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  });
}

function paintSalida({provincia, canton, servicio}){
  $out.classList.remove('animate__fadeInUp');
  $out.innerHTML = `
    <h3>Resumen de selección</h3>
    <p><b>Provincia:</b> ${provincia} &nbsp;•&nbsp; <b>Cantón:</b> ${canton} &nbsp;•&nbsp; <b>Servicio:</b> ${servicio}</p>
    <ul class="quote-list">
      <li><b>Disponibilidad:</b> Lunes a Sábado, 8:00 a 18:00</li>
      <li><b>Tiempo estimado de respuesta:</b> 1–2 horas</li>
      <li><b>Área de cobertura:</b> 100% del cantón seleccionado</li>
    </ul>
    <div style="margin-top:.8rem;">
      <a class="btn btn--secondary" href="reto7_cotizador.html">Cotizar este servicio</a>
    </div>
  `;
  $out.classList.add('animate__fadeInUp');
}

// Cargar provincias al iniciar
(function init(){
  fillSelect($prov, Object.keys(DATA));
})();

// Eventos
$prov.addEventListener('change', ()=>{
  const p = $prov.value;
  if(!p){
    enable($cant, false); enable($serv, false);
    clearSelect($cant); clearSelect($serv);
    return;
  }
  const cantones = Object.keys(DATA[p]);
  fillSelect($cant, cantones);
  enable($cant, true);
  // reset servicio
  clearSelect($serv);
  enable($serv, false);
  $out.innerHTML = "";
});

$cant.addEventListener('change', ()=>{
  const p = $prov.value;
  const c = $cant.value;
  if(!p || !c){
    enable($serv, false); clearSelect($serv);
    return;
  }
  const servicios = DATA[p][c];
  fillSelect($serv, servicios);
  enable($serv, true);
  $out.innerHTML = "";
});

$frm.addEventListener('submit', (e)=>{
  e.preventDefault();

  const provincia = $prov.value;
  const canton    = $cant.value;
  const servicio  = $serv.value;

  let errores = [];
  if(!provincia) errores.push("Seleccione la provincia.");
  if(!canton)    errores.push("Seleccione el cantón.");
  if(!servicio)  errores.push("Seleccione el servicio.");

  if(errores.length){
    Swal.fire({
      icon:'warning',
      title:'Faltan datos',
      html:'<ul style="text-align:left; margin:0; padding-left:1.1rem;">' +
           errores.map(e=>`<li>${e}</li>`).join('') + '</ul>'
    });
    return;
  }

  // Mostrar disponibilidad y CTA
  paintSalida({provincia, canton, servicio});

  // También un SweetAlert de confirmación
  Swal.fire({
    icon:'success',
    title:'Selección lista',
    html:`<p><b>${servicio}</b> en <b>${canton}, ${provincia}</b></p>
          <p>Puedes continuar al cotizador para obtener el total estimado.</p>`,
    confirmButtonText:'Ir al cotizador',
    confirmButtonColor:'#198754',
    showCancelButton:true,
    cancelButtonText:'Cerrar'
  }).then(r=>{
    if(r.isConfirmed){
      window.location.href = 'reto7_cotizador.html';
    }
  });
});

$btnLimpiar.addEventListener('click', ()=>{
  $frm.reset();
  clearSelect($cant); clearSelect($serv);
  enable($cant, false); enable($serv, false);
  $out.innerHTML = "";
});
