// /front-end/js/auth.js

// Este script se ejecuta en TODAS las páginas que lo incluyan.
// Se encarga de mostrar/ocultar los botones del navbar según si el usuario
// ha iniciado sesión o no.

document.addEventListener("DOMContentLoaded", () => {
  //  Obtener el usuario desde localStorage
  const usuarioJSON = localStorage.getItem("usuario");
  const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

  //  Obtener los botones del navbar
  const navLogin = document.getElementById("nav-login");
  const navProfile = document.getElementById("nav-profile");

  //  Si hay usuario → ocultar "Iniciar sesión" y mostrar "Mi perfil"
  if (usuario) {
    if (navLogin) navLogin.classList.add("d-none");
    if (navProfile) navProfile.classList.remove("d-none");
  } else {
    // Si NO hay usuario → mostrar "Iniciar sesión" y ocultar "Mi perfil"
    if (navLogin) navLogin.classList.remove("d-none");
    if (navProfile) navProfile.classList.add("d-none");
  }

  
});
