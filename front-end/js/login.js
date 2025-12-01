const API_URL = "http://localhost:3000";

document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const msg = document.getElementById("mensaje-login");
    msg.style.display = "none";

    const identificador = document.getElementById("identificador").value.trim();
    const contrasenia = document.getElementById("contrasenia").value.trim();

    try {
        const res = await fetch(`${API_URL}/usuarios/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                identificador,
                contrasenia
            })
        });

        const data = await res.json();

        if (!res.ok) {
            msg.style.display = "block";
            msg.innerHTML = `<div class="alert alert-danger">${data.mensaje || "Credenciales incorrectas."}</div>`;
            return;
        }

        localStorage.setItem("usuarioId", data.usuario._id);
        localStorage.setItem("nombreUsuario", data.usuario.nombreUsuario);

        msg.style.display = "block";
        msg.innerHTML = `<div class="alert alert-success">Inicio de sesión exitoso.</div>`;

        setTimeout(() => {
            window.location.href = "pagina-principal.html";
        }, 1200);

    } catch (error) {
        msg.style.display = "block";
        msg.innerHTML = `<div class="alert alert-danger">Error de conexión.</div>`;
    }
});