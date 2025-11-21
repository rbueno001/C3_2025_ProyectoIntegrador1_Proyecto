/* ============================================
   BÚSQUEDA DE RECETAS
   – Carga todas las recetas desde el backend
   – Filtra por texto, ingrediente y dificultad
============================================ */

let todasLasRecetas = [];

async function cargarRecetas() {
    try {
        const respuesta = await fetch("http://localhost:3000/recetas");
        const datos = await respuesta.json();
        todasLasRecetas = datos || [];
        mostrarRecetas(todasLasRecetas);
    } catch (error) {
        console.error("Error al cargar recetas:", error);
    }
}

function mostrarRecetas(lista) {
    const contenedor = document.getElementById("contenedor-recetas");
    const mensajeSinResultados = document.getElementById("mensaje-sin-resultados");

    contenedor.innerHTML = "";

    if (!lista.length) {
        mensajeSinResultados.classList.remove("d-none");
        return;
    }

    mensajeSinResultados.classList.add("d-none");

    lista.forEach(receta => {
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
                    <p class="small text-muted mb-1">
                        <strong>Autor:</strong> ${receta.autor?.nombreUsuario || "Desconocido"}
                    </p>
                    <a href="/front-end/detalle-receta.html?id=${receta._id}" class="btn btn-vino btn-sm mt-2">
                        Ver detalles
                    </a>
                </div>
            </div>
        `;

        contenedor.appendChild(col);
    });
}

/* Filtrado principal */
document.getElementById("form-buscar").addEventListener("submit", (evento) => {
    evento.preventDefault();

    const texto = document.getElementById("textoBusqueda").value.toLowerCase();
    const ing = document.getElementById("ingredienteBusqueda").value.toLowerCase();
    const dificultad = document.getElementById("dificultadBusqueda").value;

    const filtradas = todasLasRecetas.filter(r => {
        const coincideTexto =
            !texto ||
            r.titulo?.toLowerCase().includes(texto) ||
            r.descripcion?.toLowerCase().includes(texto) ||
            r.autor?.nombreUsuario?.toLowerCase().includes(texto);

        const coincideIngrediente =
            !ing ||
            (r.ingredientes || []).some(i =>
                i.nombre.toLowerCase().includes(ing)
            );

        const coincideDificultad =
            !dificultad || r.dificultad === dificultad;

        return coincideTexto && coincideIngrediente && coincideDificultad;
    });

    mostrarRecetas(filtradas);
});

/* Cargar al entrar a la página */
document.addEventListener("DOMContentLoaded", cargarRecetas);