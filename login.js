// Validación requerida por la guía: user=cenfo / pass=123
// Micro-interacción con SweetAlert2
document.getElementById('btnLogin').addEventListener('click', function(){
  const u = document.getElementById('user').value.trim();
  const p = document.getElementById('pass').value.trim();

  if(u === '' || p === ''){
    Swal.fire({
        title: "Verificar la entrada de datos",
        text: ptext,
        confirmButtonText: "Intentar de nuevo",
        confirmButtonColor: "#8b0000",
        html: '<iframe width="320" height="240" frameborder="0" src="https://lottie.host/embed/2d291f4e-64c8-46a2-ae3a-bb4d3c983dc7/8gL5jbK3jC.json"> </iframe> <br><p>' + ptext + " </p>", 
    });
    return;
  }

  if(u === 'cenfo' && p === '123'){
    Swal.fire({
                title: "Acceso correcto",
                showConfirmButton: false,
                customClass: {                 
                    title: 'formatos1',                      
                },
                timer: 2300,
                html: '<iframe width="320" height="240" frameborder="0" src="https://lottie.host/embed/5c5b12b1-d2ff-4cf4-97fc-a6c3df2d9a2f/E9NxaObVq1.lottie"></iframe> <br><br><p>Esperar un momento...</p>',                
            }).then(()=>{ window.location.href = 'landing.html'; });
  }else{
    Swal.fire({icon:'error', title:'Acceso denegado', text:'Usuario o clave incorrectos.'});
  }
});
