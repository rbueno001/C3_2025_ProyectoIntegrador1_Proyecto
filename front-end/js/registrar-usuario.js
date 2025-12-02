/* ============================================================
   REGISTRO DE USUARIOS
============================================================ */

document.getElementById("formRegistro").addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        nombreUsuario: document.getElementById("usuario").value.trim(),
        cedula: document.getElementById("cedula").value.trim(),
        celular: document.getElementById("celular").value.trim(),
        contrasenia: document.getElementById("contrasenia").value.trim(),
        intereses: [...document.querySelectorAll(".interes:checked")].map(i => i.value),
        nivelConocimiento: document.getElementById("nivelConocimiento").value,
        rol: "usuario"
    };

    try {
        const respuesta = await fetch("http://localhost:3000/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            document.getElementById("mensaje-registro").innerHTML = `
                <div class="alert alert-success">
                    Registro completado con éxito. Ahora puedes iniciar sesión.
                </div>
            `;
            document.getElementById("formRegistro").reset();

        } else {
            document.getElementById("mensaje-registro").innerHTML = `
                <div class="alert alert-danger">
                    ${resultado.mensaje || "No se pudo registrar el usuario."}
                </div>
            `;
        }

    } catch (error) {
        document.getElementById("mensaje-registro").innerHTML = `
            <div class="alert alert-danger">
                Error al conectar con el servidor.
            </div>
        `;
    }
});