/* ============================================================
   VARIABLES
============================================================ */
let todasLasRecetas = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarRecetas();
    inicializarEventos();
});

/* ============================================================
   CARGAR TODAS LAS RECETAS
============================================================ */
async function cargarRecetas() {
    try {
        const res = await fetch("http://localhost:3000/recetas");
        const data = await res.json();
        todasLasRecetas = Array.isArray(data) ? data : [];
        renderizarRecetas(todasLasRecetas);
    } catch (error) {
        console.error("Error cargando recetas:", error);
    }
}

/* ============================================================
   EVENTOS
============================================================ */
function inicializarEventos() {

    document.getElementById("form-buscar").addEventListener("submit", (e) => {
        e.preventDefault();
        aplicarFiltros();
    });

    document.getElementById("btn-agregar-ingrediente").addEventListener("click", () => {
        const fila = crearFilaFiltroIngrediente();
        document.getElementById("contenedor-filtros-ingredientes").appendChild(fila);
    });

    document.getElementById("btn-limpiar").addEventListener("click", limpiarFiltros);

    document.getElementById("contenedor-filtros-ingredientes").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-eliminar-filtro")) {
            const fila = e.target.closest(".filtro-ingrediente-row");
            const total = document.querySelectorAll(".filtro-ingrediente-row").length;
            if (total > 1) fila.remove();
        }
    });

    document.getElementById("btnBuscarNombre").addEventListener("click", buscarPorNombre);
}

/* ============================================================
   BUSCAR POR NOMBRE
============================================================ */
function buscarPorNombre() {
    const texto = document.getElementById("buscarPorNombre").value.trim().toLowerCase();

    if (texto === "") {
        renderizarRecetas(todasLasRecetas);
        return;
    }

    const filtradas = todasLasRecetas.filter(receta =>
        receta.titulo && receta.titulo.toLowerCase().includes(texto)
    );

    renderizarRecetas(filtradas);

    document.getElementById("mensaje-sin-resultados")
        .classList.toggle("d-none", filtradas.length > 0);
}

/* ============================================================
   FILTROS DE INGREDIENTES
============================================================ */
function crearFilaFiltroIngrediente() {
    const fila = document.createElement("div");
    fila.className = "row g-2 filtro-ingrediente-row align-items-center mb-2";

    fila.innerHTML = `
        <div class="col-md-3">
            <select class="form-select input-custom filtro-tipo">
                <option value="con">Con este ingrediente</option>
                <option value="sin">Sin este ingrediente</option>
            </select>
        </div>

        <div class="col-md-7">
            <input type="text" class="form-control input-custom filtro-nombre"
                   placeholder="Nombre del ingrediente...">
        </div>

        <div class="col-md-2 d-grid">
            <button type="button" class="btn btn-outline-secondary btn-eliminar-filtro">
                Quitar
            </button>
        </div>
    `;
    return fila;
}

function limpiarFiltros() {
    const filas = document.querySelectorAll(".filtro-ingrediente-row");
    filas.forEach((fila, i) => {
        if (i === 0) {
            fila.querySelector(".filtro-nombre").value = "";
            fila.querySelector(".filtro-tipo").value = "con";
        } else {
            fila.remove();
        }
    });

    renderizarRecetas(todasLasRecetas);
}

function aplicarFiltros() {
    const filas = document.querySelectorAll(".filtro-ingrediente-row");
    const filtros = [];

    filas.forEach(fila => {
        const tipo = fila.querySelector(".filtro-tipo").value;
        const nombre = fila.querySelector(".filtro-nombre").value.trim().toLowerCase();
        if (nombre !== "") filtros.push({ tipo, nombre });
    });

    if (filtros.length === 0) {
        renderizarRecetas(todasLasRecetas);
        return;
    }

    const resultado = todasLasRecetas.filter(receta => {
        const ing = receta.ingredientes || [];

        return filtros.every(filtro => {
            const contiene = ing.some(i => i.nombre?.toLowerCase().includes(filtro.nombre));
            return filtro.tipo === "con" ? contiene : !contiene;
        });
    });

    renderizarRecetas(resultado);

    document.getElementById("mensaje-sin-resultados")
        .classList.toggle("d-none", resultado.length > 0);
}

/* ============================================================
   MOSTRAR RESULTADOS
============================================================ */
function renderizarRecetas(lista) {
    const cont = document.getElementById("contenedor-recetas");
    cont.innerHTML = "";

    if (!lista.length) return;

    lista.forEach(receta => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        col.innerHTML = `
            <article class="card shadow-sm h-100">
                <div class="card-body">
                    <h5>${receta.titulo || "Sin título"}</h5>
                    <p class="text-muted small">${receta.descripcion || "Sin descripción"}</p>
                    <p class="small text-muted">
                        Ingredientes: ${
                            receta.ingredientes?.map(i => i.nombre).join(", ") || "No especificados"
                        }
                    </p>
                </div>
            </article>
        `;
        cont.appendChild(col);
    });
}