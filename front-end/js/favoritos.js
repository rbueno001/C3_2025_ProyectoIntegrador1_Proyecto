const API_URL = "http://localhost:3000";

/* ============================================================
   CARGAR FAVORITOS
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    cargarFavoritos();
});

async function cargarFavoritos() {
    const contenedor = document.getElementById("listaFavoritos");
    contenedor.innerHTML = "";

    const usuario = JSON.parse(sessionStorage.getItem("usuario"));

    if (!usuario) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    Debe iniciar sesión para ver sus recetas favoritas.
                </div>
            </div>
        `;
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/usuarios/${usuario._id}`);
        const data = await respuesta.json();

        const favoritos = data.favoritos || [];

        if (favoritos.length === 0) {
            contenedor.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        Aún no tiene recetas marcadas como favoritas.
                    </div>
                </div>
            `;
            return;
        }

        favoritos.forEach(receta => {
            const col = document.createElement("div");
            col.classList.add("col-md-4");

            const imagen = receta.fotoPrincipal
                ? `${API_URL}/${receta.fotoPrincipal.replace(/\\/g, "/")}`
                : "imgs/default.jpg";

            col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${imagen}" class="card-img-top"
                        style="height: 200px; object-fit: cover;" alt="${receta.titulo}">
                    
                    <div class="card-body">
                        <h5 class="card-title">${receta.titulo}</h5>

                        <p class="text-muted small">
                            ${receta.categoria} · ${receta.complejidad}
                        </p>

                        <button class="btn btn-vino w-100" onclick="verDetalle('${receta._id}')">
                            Ver receta
                        </button>
                    </div>
                </div>
            `;

            contenedor.appendChild(col);
        });

    } catch (error) {
        console.error("Error al cargar favoritos:", error);
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center">
                    Error al cargar recetas favoritas.
                </div>
            </div>
        `;
    }
}

/* ============================================================
   IR AL DETALLE
============================================================ */
function verDetalle(id) {
    window.location.href = `detalle-receta.html?id=${id}`;
}