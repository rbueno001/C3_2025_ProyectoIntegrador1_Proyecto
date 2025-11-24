document.addEventListener("DOMContentLoaded", () => {

  // Obtener usuario desde localStorage
  const usuarioJSON = localStorage.getItem("usuario");
  const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;

  //  Control del navbar (mostrar u ocultar botones)
  const navLogin = document.getElementById("nav-login");
  const navProfile = document.getElementById("nav-profile");

  if (usuario) {
    if (navLogin) navLogin.classList.add("d-none");
    if (navProfile) navProfile.classList.remove("d-none");
  } else {
    if (navLogin) navLogin.classList.remove("d-none");
    if (navProfile) navProfile.classList.add("d-none");
  }

  //  Si no hay usuario → redirigir a login
  if (!usuario) {
    window.location.href = "/front-end/login.html";
    return;
  }

  //  Rellenar los datos del perfil
  const nombreEl = document.getElementById("perfil-nombre");
  const correoEl = document.getElementById("perfil-correo");
  const fotoEl = document.getElementById("perfil-foto");

  nombreEl.textContent = usuario.nombre || "Usuario";
  correoEl.textContent = usuario.correo || "Correo no disponible";
  fotoEl.src = usuario.foto || "/imgs/user-placeholder.png";

  //  Valores opcionales: favoritos, comentarios, likes
  document.getElementById("perfil-favoritos").textContent = usuario.favoritos ?? 0;
  document.getElementById("perfil-comentarios").textContent = usuario.comentarios ?? 0;
  document.getElementById("perfil-likes").textContent = usuario.likes ?? 0;

  // 6️⃣ Cerrar sesión
  const btnLogout = document.getElementById("btn-logout");
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "/front-end/pagina-principal.html";
  });

  //  Editar perfil (por ahora solo mensaje)
  const btnEditar = document.getElementById("btn-editar-perfil");
  btnEditar.addEventListener("click", () => {
    alert("La función para editar perfil se implementará más adelante 🙂");
  });

});
