// ================================
// CONFIG
// ================================
const API_URL = "http://localhost:3000";

// Cargar automáticamente al abrir la página
document.addEventListener("DOMContentLoaded", cargarDetalle);

// ================================
// CARGAR DETALLE DE LA RECETA
// ================================
async function cargarDetalle() {
    const params = new URLSearchParams(window.location.search);
    const recetaId = params.get("id");

    if (!recetaId) {
        mostrarError("No se encontró el ID de la receta.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/recetas/${recetaId}`);
        if (!res.ok) {
            mostrarError("No se pudo obtener la receta.");
            return;
        }

        const receta = await res.json();
        renderizarReceta(receta);

    } catch (error) {
        console.error("Error cargando receta:", error);
        mostrarError("Error al conectar con el servidor.");
    }
}

// ================================
// LLENAR HTML CON DATOS DE MONGO
// ================================
function renderizarReceta(r) {
    const cont = document.getElementById("detalleReceta");
    cont.innerHTML = `
        <h2 class="mb-3">${r.titulo}</h2>

        <p><strong>Autor:</strong> ${r.autorNombre || "Autor desconocido"}</p>
        <p><strong>Categoría:</strong> ${r.categoria || "Sin categoría"}</p>
        <p><strong>Complejidad:</strong> ${r.complejidad || "N/A"}</p>
        <p><strong>Porciones:</strong> ${r.porciones || "N/A"}</p>
        <p><strong>Tiempo:</strong> ${r.tiempoPreparacionMin || "N/A"} min</p>

        <img src="${r.imagenPrincipal ? API_URL + "/" + r.imagenPrincipal : "imgs/default.jpg"}"
            class="img-fluid rounded mb-4" alt="Imagen receta">

        <h4>Descripción</h4>
        <p>${r.descripcion || "Sin descripción."}</p>

        <hr>

        <h4>Ingredientes</h4>
        <ul id="listaIngredientes" class="list-group mb-4"></ul>

        <button id="btnAgregarALista" class="btn btn-vino mb-4">
            Agregar ingredientes a la lista de compras
        </button>

        <hr>

        <h4>Pasos</h4>
        <div id="listaPasos"></div>
    `;

    // Ingredientes
    const ulIng = document.getElementById("listaIngredientes");
    ulIng.innerHTML = "";

    if (Array.isArray(r.ingredientes)) {
        r.ingredientes.forEach(ing => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = `${ing.nombre} — ${ing.cantidad} ${ing.unidad || ""}`;
            ulIng.appendChild(li);
        });
    }

    // Pasos
    const pasosDiv = document.getElementById("listaPasos");
    pasosDiv.innerHTML = "";

    if (Array.isArray(r.pasos)) {
        r.pasos.forEach((p, i) => {
            const paso = document.createElement("div");
            paso.className = "mb-3";

            paso.innerHTML = `
                <h6>Paso ${i + 1}</h6>
                <p>${p.instruccion || "—"}</p>

                ${p.imagenUrl ? `<img src="${API_URL}/${p.imagenUrl}" class="img-fluid rounded mb-2">` : ""}
                ${p.videoUrl ? `<video controls class="w-100"><source src="${API_URL}/${p.videoUrl}"></video>` : ""}
            `;
            pasosDiv.appendChild(paso);
        });
    }

    // Botón: agregar ingredientes a la lista de compras
    document.getElementById("btnAgregarALista").addEventListener("click", () => {
        agregarIngredientesALista(r.ingredientes || []);
    });
}

// ================================
// AGREGAR INGREDIENTES A LISTA DE COMPRAS
// ================================
function agregarIngredientesALista(ingredientes) {
    if (!ingredientes.length) return;

    let lista = JSON.parse(localStorage.getItem("listaCompras")) || [];

    // Agregar al localStorage
    lista.push(...ingredientes);

    localStorage.setItem("listaCompras", JSON.stringify(lista));

    alert("Ingredientes agregados a la lista de compras.");
}

// ================================
// MOSTRAR ERROR
// ================================
function mostrarError(msg) {
    const cont = document.getElementById("detalleReceta");
    cont.innerHTML = `
        <h2>Error</h2>
        <p>${msg}</p>
    `;
}