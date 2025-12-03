/* ===========================
   CleanQuote — Tour 360 (QUIZ)
   Archivo: js/tour.js
   =========================== */

(function(){
  THREE.Cache.enabled = false;

  // Intentaremos varias variantes comunes de nombre/extensión/mayúsculas:
  const CANDIDATES = [
    'img/oficina_360.jpg',
    'img/oficina_360.jpeg',
    'img/oficina_360.JPG',
    'img/Oficina_360.jpg',
    'img/Oficina_360.JPG',
    'img/oficina-360.jpg',
    'img/oficina.jpg'
  ];

  // UI de carga
  const loadingEl = document.getElementById('loading');
  const barEl     = document.getElementById('loadingBar');
  const pctEl     = document.getElementById('loadingPct');

  function updateProgress(p){
    const v = Math.max(0, Math.min(100, Math.round(p || 0)));
    if (barEl) barEl.style.width = v + '%';
    if (pctEl) pctEl.textContent = v + '%';
  }
  function hideLoading(){ if (loadingEl) loadingEl.style.display = 'none'; }

  // Busca la primera ruta que exista (HEAD 200)
  async function resolvePanoUrl() {
    for (const rel of CANDIDATES) {
      try {
        const res = await fetch(rel + '?cb=' + Date.now(), { method:'HEAD', cache:'no-store' });
        if (res.ok) return rel + '?cb=' + Date.now();
      } catch (_) {}
    }
    throw new Error('No se encontró ninguna imagen válida entre: ' + CANDIDATES.join(', '));
  }

  // Arranque
  resolvePanoUrl()
    .then((panoUrl) => init(panoUrl))
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Imagen 360 no accesible',
        html: `
          <p>${err.message}</p>
          <hr>
          <ol style="text-align:left">
            <li>Asegura que el archivo esté en la carpeta <code>img/</code> (junto a <code>tour.html</code>).</li>
            <li>Renómbralo a <code>oficina_360.jpg</code> (minúsculas, una sola extensión).</li>
            <li>Abre con Live Server (no <code>file://</code>).</li>
            <li>La imagen debe ser 2:1 (p.ej. 4096×2048 o 6000×3000).</li>
          </ol>
        `
      });
    });

  function init(PANO_URL){
    // Crea panorama y visor (Panolens 0.11.0 + Three 0.121.1)
    const panorama = new PANOLENS.ImagePanorama(PANO_URL);
    const viewer = new PANOLENS.Viewer({
      container: document.getElementById('viewer'),
      autoRotate: true,
      autoRotateSpeed: 0.5,
      controlBar: true
    });

    panorama.addEventListener('progress', (e) => {
      updateProgress(e && typeof e.progress === 'number' ? e.progress : 0);
    });
    panorama.addEventListener('load', () => {
      updateProgress(100);
      setTimeout(hideLoading, 150);
    });
    panorama.addEventListener('error', () => {
      Swal.fire({
        icon: 'error',
        title: 'Error cargando el panorama',
        html: `
          <p>Posibles causas:</p>
          <ol style="text-align:left">
            <li>El archivo no es un JPG válido o está corrupto.</li>
            <li>No es equirectangular 2:1 (recomendado 4096×2048).</li>
            <li>La textura es demasiado grande para tu GPU (prueba con 4096×2048).</li>
          </ol>
        `
      });
    });

    viewer.add(panorama);

    /* ---------- Helpers SweetAlert ---------- */
    function showText(title, text){
      Swal.fire({ title, html: `<p style="text-align:left">${text}</p>` });
    }
    function showTextImage(title, text, imgSrc){
      Swal.fire({
        title, width:'auto',
        html: `
          <div style="display:grid;gap:10px">
            <img src="${imgSrc}" alt="" style="max-width:100%;border-radius:10px" />
            <p style="text-align:left">${text}</p>
          </div>`
      });
    }
    function showPDF(title, pdfSrc){
      Swal.fire({ title, width:'auto', html:`<iframe class="embed" src="${pdfSrc}"></iframe>` });
    }
    function showAudio(title, audioSrc){
      Swal.fire({
        title,
        html: `
          <p>Reproduce el audio:</p>
          <audio id="cq-audio" controls style="width:min(90vw,700px)">
            <source src="${audioSrc}" type="audio/mpeg" />
            Tu navegador no soporta audio HTML5.
          </audio>`,
        didOpen: () => {
          // Intento de autoplay (tras clic en hotspot suele permitirse)
          const el = document.getElementById('cq-audio');
          if (el) { el.play().catch(()=>{}); }
        }
      });
    }
    function showAlertBasic(){
      Swal.fire('Información', 'Pagina en construcción.', 'info');
    }
    function showYouTube(title, ytId, {autoplay=true, startAt=0} = {}){
      const params = [
        'rel=0', 'modestbranding=1', 'playsinline=1',
        startAt ? `start=${startAt}` : '',
        autoplay ? 'autoplay=1&mute=1' : ''
      ].filter(Boolean).join('&');

      Swal.fire({
        title, width:'auto',
        html: `
          <iframe class="embed"
            src="https://www.youtube-nocookie.com/embed/${ytId}?${params}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen></iframe>`,
        didClose: () => {
          const iframe = document.querySelector('.swal2-popup iframe');
          if (iframe) iframe.src = iframe.src;
        }
      });
    }

    /* ---------- Utilidad para crear hotspots ---------- */
    function addSpot({x,y,z, hover='Ver más', onClick}){
      const spot = new PANOLENS.Infospot(350, PANOLENS.DataImage.Info);
      spot.position.set(x,y,z);
      spot.addHoverText(hover, 20);
      if (typeof onClick === 'function') spot.addEventListener('click', onClick);
      panorama.add(spot);
    }

    /* ---------- 10 hotspots (CleanQuote) ---------- */
    addSpot({
      x: 3000, y: 0, z: -1000,
      hover: 'Bienvenida',
      onClick: () => showText('Bienvenido a CleanExperts', 'Explora el espacio y abre los puntos para conocer servicios, antes/después y certificaciones.')
    });

    addSpot({
      x: -2500, y: 500, z: -1200,
      hover: 'Antes / Después',
      onClick: () => showTextImage('Antes / Después','Resultados de limpieza profesional en superficies de alto tránsito.','img/antes_despues.jpg')
    });

    addSpot({
      x: -500, y: -400, z: 3000,
      hover: 'Certificados (PDF)',
      onClick: () => showPDF('Certificados y Protocolos','pdf/certificados.pdf')
    });

    // Video demostración — YouTube con autoplay (muteado)
    addSpot({
      x: 1500, y: -1000, z: -2200,
      hover: 'Video demostración',
      onClick: () => showYouTube('Demostración de servicio', 'vw2bQk3PZC4', { autoplay:true })
    });

    addSpot({
      x: -3200, y: -200, z: 800,
      hover: 'Testimonio (audio)',
      onClick: () => showAudio('Testimonio de cliente', 'audio/testimonio_cliente.mp3')
    });

    addSpot({
      x: 500, y: 1200, z: 2800,
      hover: 'Cotiza ahora',
      onClick: showAlertBasic
    });

    addSpot({
      x: 2800, y: -200, z: 1000,
      hover: 'Quiénes somos',
      onClick: () => showText('Quiénes somos','CleanExperts: limpieza residencial y empresarial con enfoque eco-friendly.')
    });

    addSpot({
      x: -1200, y: 1400, z: -2400,
      hover: 'Servicios',
      onClick: () => showTextImage('Servicios','Limpieza residencial, oficinas, profunda, alfombras, desinfección.','img/servicios.jpg')
    });

    addSpot({
      x: -100, y: -1500, z: -3100,
      hover: 'Productos eco',
      onClick: () => showTextImage('Productos ecológicos','Insumos certificados y técnicas seguras para familia y mascotas.','img/productos.jpg')
    });

    addSpot({
      x: -2000, y: 200, z: 2200,
      hover: 'Créditos',
      onClick: () => showText('Créditos','Autor: Ricardo Botero Z. — Curso: Fundamentos de Programación Web')
    });

  } // fin init()
})();
