document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombreUsuarioOCorreo = document.getElementById("nombreUsuarioOCorreo").value.trim();
    const contrasenia = document.getElementById("contrasenia").value.trim();
    const errorBox = document.getElementById("loginError");

    errorBox.classList.add("d-none");
    errorBox.textContent = "";

    try {
        const respuesta = await fetch("http://localhost:3000/usuarios/validar-credenciales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombreUsuarioOCorreo,
                contrasenia
            })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            errorBox.textContent = data.mensaje || "Credenciales incorrectas";
            errorBox.classList.remove("d-none");
            return;
        }

        // Guardar usuario en sessionStorage
        sessionStorage.setItem("usuario", JSON.stringify(data.usuario));

        // Redirigir al inicio
        window.location.href = "/front-end/pagina-principal.html";

    } catch (error) {
        errorBox.textContent = "Error de conexión con el servidor";
        errorBox.classList.remove("d-none");
    }
});