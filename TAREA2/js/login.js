// login.js  – Validación sencilla con SweetAlert
document
  .getElementById('frmLogin')
  .addEventListener('submit', function (e) {
    e.preventDefault();            // evita recarga
    const user = document.getElementById('txtUser').value.trim();
    const pass = document.getElementById('txtPass').value.trim();

    if (user === 'cenfo' && pass === '123') {
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Acceso concedido',
        timer: 1500,
        showConfirmButton: false
      }).then(() => window.location.href = 'landing.html');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales incorrectas',
        text: 'Usuario o clave inválidos'
      });
    }
  });
