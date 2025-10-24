document.getElementById("btn-login").addEventListener("click", (e)=>{
  e.preventDefault();
  const u = document.getElementById("in-txt-user").value.trim();
  const p = document.getElementById("in-txt-pass").value.trim();

  if(!u || !p){
    Swal.fire({icon:'warning', title:'Campos vacíos', text:'Complete usuario y contraseña.'});
    return;
  }
  if(u === "cenfo" && p === "123"){
    localStorage.setItem('isLoggedIn', 'true');
    Swal.fire({icon:'success', title:'Acceso correcto', timer:1300, showConfirmButton:false})
      .then(()=> window.location.href = "reto3_landing.html");
  }else{
    Swal.fire({icon:'error', title:'Credenciales incorrectas'});
  }
});
