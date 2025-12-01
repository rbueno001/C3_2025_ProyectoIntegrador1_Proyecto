const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formRegistro");
    const mensaje = document.getElementById("mensaje-registro");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // ====== CAPTURAR DATOS DEL FORMULARIO ======
        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const usuario = document.getElementById("usuario").value.trim();
        const cedula = document.getElementById("cedula").value.trim();
        const celular = document.getElementById("celular").value.trim();
        const contrasenia = document.getElementById("contrasenia").value.trim();
        const nivel = document.getElementById("nivel").value;

        // Intereses (checkboxes)
        const intereses = [...document.querySelectorAll(".interes:checked")].map(i => i.value);

        // ====== OBJETO QUE SE ENVIARÁ ======
        const nuevoUsuario = {
            nombre,
            correo,
            usuario,
            cedula,
            celular,
            contrasenia,
            intereses,
            nivel
        };

        console.log("ENVIANDO:", nuevoUsuario);

        try {
            const res = await fetch(`${API_URL}/usuarios/registrar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoUsuario)
            });

            const data = await res.json();

            if (!res.ok) {
                mensaje.style.color = "red";
                mensaje.textContent = data.message || "Error al registrar usuario";
                mensaje.style.display = "block";
                return;
            }

            // ====== REGISTRO EXITOSO ======
            mensaje.style.color = "green";
            mensaje.textContent = "Usuario registrado correctamente";
            mensaje.style.display = "block";

            // Redirigir después de 1.5s
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } catch (error) {
            console.error("Error:", error);
            mensaje.style.color = "red";
            mensaje.textContent = "Error de conexión con el servidor.";
            mensaje.style.display = "block";
        }
    });
});