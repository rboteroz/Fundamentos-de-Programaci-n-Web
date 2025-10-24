// Reto 5 — Galería: lightbox simple con SweetAlert2
document.querySelectorAll('#galeria img').forEach(img => {
  img.style.cursor = 'zoom-in'; // feedback visual
  img.addEventListener('click', () => {
    Swal.fire({
      title: img.alt || 'Vista previa',
      imageUrl: img.src,
      imageAlt: img.alt || 'imagen',
      showCloseButton: true,
      showConfirmButton: false,
      width: '80%',           // ancho del modal
      backdrop: true,
      background: '#fff'
    });
  });
});

console.log("Reto 5 listo: Galería con ampliación.");
