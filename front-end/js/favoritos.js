/* ============================================
   RECETAS FAVORITAS
   – Usa el usuario guardado en localStorage
   – Consulta sus recetas favoritas al backend
============================================ */

async function cargarFavoritos() {
    const contenedor = document.getElementById("contenedor-favoritos");
    const mensaje = document.getElementById("mensaje-favoritos");

    contenedor.innerHTML = "";
    mensaje.innerHTML = "";

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        mensaje.innerHTML = `
            <div class="alert alert-warning">
                Debe iniciar sesión para ver sus recetas favoritas.
            </div>
        `;
        return;
    }

    try {
        const respuesta = await fetch(`http://localhost:3000/usuarios/${usuario.id}`);
        const datos = await respuesta.json();

        const favoritos = datos.favoritos || [];

        if (!favoritos.length) {
            mensaje.innerHTML = `
                <div class="alert alert-info">
                    Aún no tiene recetas marcadas como favoritas.
                </div>
            `;
            return;
        }

        favoritos.forEach(receta => {
            const col = document.createElement("div");
            col.classList.add("col-12", "col-sm-6", "col-lg-4");

            const imagen = receta.imagenPrincipal
                ? `http://localhost:3000${receta.imagenPrincipal}`
                : "/imgs/default-recipe.jpg";

            col.innerHTML = `
                <div class="card shadow-sm h-100">
                    <img src="${imagen}" class="card-img-top fixed-img" alt="${receta.titulo}">
                    <div class="card-body">
                        <h5 class="card-title text-dark">${receta.titulo}</h5>
                        <p class="card-text text-muted small">
                            ${receta.descripcion ? receta.descripcion.substring(0, 90) + "..." : ""}
                        </p>
                        <a href="/front-end/detalle-receta.html?id=${receta._id}" class="btn btn-vino btn-sm mt-2">
                            Ver detalles
                        </a>
                    </div>
                </div>
            `;

            contenedor.appendChild(col);
        });

    } catch (error) {
        console.error("Error al cargar favoritos:", error);
        mensaje.innerHTML = `
            <div class="alert alert-danger">
                Ocurrió un error al cargar sus recetas favoritas.
            </div>
        `;
    }
}

document.addEventListener("DOMContentLoaded", cargarFavoritos);