// /front-end/js/auth.js

// Devuelve el usuario actual desde sessionStorage o localStorage
function obtenerUsuarioActual() {
  const uStr = sessionStorage.getItem("usuario") || localStorage.getItem("usuario");
  if (!uStr) return null;

  try {
    return JSON.parse(uStr);
  } catch (e) {
    console.error("Error parseando usuario:", e);
    return null;
  }
}

// Cerrar sesión (por si luego lo quieres usar en algún botón)
function cerrarSesion() {
  sessionStorage.removeItem("usuario");
  localStorage.removeItem("usuario");
  window.location.href = "/front-end/pagina-principal.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const usuario = obtenerUsuarioActual();

  const btnLogin   = document.getElementById("nav-login");
  const btnProfile = document.getElementById("nav-profile");
  const navAdmin   = document.getElementById("nav-admin-link");

  if (usuario) {
    // Ocultar "Iniciar sesión", mostrar "Mi perfil"
    if (btnLogin)   btnLogin.classList.add("d-none");
    if (btnProfile) btnProfile.classList.remove("d-none");

    // 🔸 Si es admin, mostrar link al panel
    if (navAdmin) {
      if (usuario.rol === "admin") {
        navAdmin.classList.remove("d-none");
      } else {
        navAdmin.classList.add("d-none");
      }
    }

  } else {
    // Usuario NO logueado
    if (btnLogin)   btnLogin.classList.remove("d-none");
    if (btnProfile) btnProfile.classList.add("d-none");
    if (navAdmin)   navAdmin.classList.add("d-none");
  }
});
