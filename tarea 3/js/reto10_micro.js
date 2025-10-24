// Reto 10 — Microinteracciones

// 1) Copiar al portapapeles con SweetAlert (toast)
const $btnCopiar = document.getElementById('btnCopiar');
const $txtCodigo = document.getElementById('txtCodigo');

$btnCopiar.addEventListener('click', async ()=>{
  const texto = $txtCodigo.value;
  try{
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(texto);
    } else {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    Swal.fire({
      toast:true, position:'top-end', timer:1500, showConfirmButton:false,
      icon:'success', title:`Copiado: ${texto}`
    });
  }catch(err){
    Swal.fire({icon:'error', title:'No se pudo copiar', text:String(err)});
  }
});

// 2) Mostrar/Ocultar panel “ver más”
const $btnToggle = document.getElementById('btnToggle');
const $panelExtra = document.getElementById('panelExtra');
let abierto = false;

$btnToggle.addEventListener('click', ()=>{
  abierto = !abierto;
  $btnToggle.textContent = abierto ? 'Ocultar' : 'Ver más';
  $panelExtra.style.display = abierto ? 'block' : 'none';
});

// 3) Botón “ir arriba” (aparece después de hacer scroll)
const $btnTop = document.getElementById('btnTop');

window.addEventListener('scroll', ()=>{
  if (window.scrollY > 200) {
    $btnTop.classList.add('visible');
  } else {
    $btnTop.classList.remove('visible');
  }
});

$btnTop.addEventListener('click', ()=>{
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
