// /front-end/js/login.js
/* ===========================================
   LOGIN DE USUARIO
=========================================== */

document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("formLogin");
  if (!formLogin) return;

  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombreUsuarioOCorreo = document.getElementById("nombreUsuarioOCorreo").value.trim();
    const contrasenia = document.getElementById("contrasenia").value.trim();

    const errorBox = document.getElementById("loginError");
    if (errorBox) {
      errorBox.classList.add("d-none");
      errorBox.textContent = "";
    }

    try {
      const respuesta = await fetch("http://localhost:3000/usuarios/validar-credenciales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreUsuarioOCorreo, contrasenia })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        if (errorBox) {
          errorBox.textContent = data.mensaje || "Credenciales incorrectas";
          errorBox.classList.remove("d-none");
        } else {
          alert(data.mensaje || "Credenciales incorrectas");
        }
        return;
      }

      // Guardar usuario
      const usuarioStr = JSON.stringify(data.usuario);
      sessionStorage.setItem("usuario", usuarioStr);
      localStorage.setItem("usuario", usuarioStr);

      // Redirigir
      window.location.href = "/front-end/pagina-principal.html";

    } catch (error) {
      console.error("Error en login:", error);
      if (errorBox) {
        errorBox.textContent = "Error de conexión con el servidor";
        errorBox.classList.remove("d-none");
      } else {
        alert("Error de conexión con el servidor");
      }
    }
  });
});