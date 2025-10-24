// Reto 8 — Buscador: filtro textual + por categoría, DOM y SweetAlert

const $frm = document.getElementById('frmBuscar');
const $txt = document.getElementById('txtBuscar');
const $cat = document.getElementById('selCategoria');
const $out = document.getElementById('gridResultados');
const $btnLimpiar = document.getElementById('btnLimpiar');

// Dataset (puedes ajustar textos, precios o añadir más items)
const servicios = [
  {
    nombre: "Limpieza de hogar básica",
    categoria: "hogar",
    descripcion: "Barrido, aspirado, baños y cocina. Opcional: ventanas.",
    img: "img/servicios_hogar.jpg",
  },
  {
    nombre: "Limpieza de oficina profunda",
    categoria: "oficina",
    descripcion: "Desinfección de alto contacto, retiro de residuos, vidrios.",
    img: "img/servicios_oficina.jpg",
  },
  {
    nombre: "Lavado de vehículo y tapicería",
    categoria: "vehiculo",
    descripcion: "Lavado interior, extracción y tratamiento de olores.",
    img: "img/servicios_vehiculo.jpg",
  },
  {
    nombre: "Lavado de alfombras",
    categoria: "especial",
    descripcion: "Lavado y extracción con equipo profesional. Secado controlado.",
    img: "img/galeria2.jpg",
  },
  {
    nombre: "Desinfección especial",
    categoria: "especial",
    descripcion: "Nebulización/aspersión con protocolos sanitarios.",
    img: "img/catalogo_desinfeccion.jpg",
  }
];

// Normaliza texto para búsquedas (minúsculas, sin tildes)
function norm(s){
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita acentos
}

function cardHTML(item){
  return `
    <article class="card animate__animated animate__fadeInUp">
      <img src="${item.img}" alt="${item.nombre}">
      <h3>${item.nombre}</h3>
      <p class="muted" style="margin-top:.25rem;">${item.descripcion}</p>
      <div style="margin-top:.6rem;">
        <a href="reto7_cotizador.html" class="btn btn--secondary">Cotizar</a>
      </div>
    </article>
  `;
}

function render(lista){
  if(!lista || lista.length === 0){
    $out.innerHTML = "";
    Swal.fire({
      icon:'info',
      title:'Sin resultados',
      text:'Ajusta tu búsqueda o cambia la categoría.',
      confirmButtonColor:'#0d6efd'
    });
    return;
  }
  $out.innerHTML = lista.map(cardHTML).join("");
}

function buscar(){
  const q = norm($txt.value);
  const c = $cat.value;

  const resultado = servicios.filter(s => {
    const coincideTexto = q === "" || norm(s.nombre + " " + s.descripcion).includes(q);
    const coincideCat   = c === "todas" || s.categoria === c;
    return coincideTexto && coincideCat;
  });

  render(resultado);
}

// Eventos
$frm.addEventListener('submit', (e)=>{ e.preventDefault(); buscar(); });
$btnLimpiar.addEventListener('click', ()=>{
  $txt.value = "";
  $cat.value = "todas";
  $out.innerHTML = "";
  $txt.focus();
});

// UX: buscar al presionar Enter o al cambiar categoría
$txt.addEventListener('keydown', (e)=>{ if(e.key === 'Enter'){ e.preventDefault(); buscar(); }});
$cat.addEventListener('change', buscar);

// Render inicial (opcional: muestra todos)
render(servicios);
