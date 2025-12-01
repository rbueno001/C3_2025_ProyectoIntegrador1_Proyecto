const API_URL = "http://localhost:3000";

/* ============================================================
   INICIALIZACIÓN
============================================================ */
document.addEventListener("DOMContentLoaded", async () => {
    await cargarRecetas();
    cargarMenuGuardado();
});

/* ============================================================
   CARGAR TODAS LAS RECETAS DEL BACKEND
============================================================ */
let recetasDisponibles = [];

async function cargarRecetas() {
    try {
        const res = await fetch(`${API_URL}/recetas`);
        recetasDisponibles = await res.json();
        llenarSelects();
    } catch (error) {
        console.error("Error al cargar recetas:", error);
    }
}

/* ============================================================
   LLENAR LOS SELECTS DE CADA DÍA
============================================================ */
function llenarSelects() {
    const selects = document.querySelectorAll("select[data-dia]");

    selects.forEach(select => {
        // Limpiar opciones previas
        select.innerHTML = `
            <option value="">Seleccione una receta...</option>
        `;

        recetasDisponibles.forEach(receta => {
            const op = document.createElement("option");
            op.value = receta._id;
            op.textContent = receta.titulo;
            select.appendChild(op);
        });
    });
}

/* ============================================================
   GUARDAR MENÚ DE UN DÍA
============================================================ */
const botonesGuardar = document.querySelectorAll("[data-guardar]");

botonesGuardar.forEach(btn => {
    btn.addEventListener("click", () => {
        const dia = btn.dataset.guardar; // lunes, martes, etc.
        const select = document.querySelector(`select[data-dia='${dia}']`);

        guardarDia(dia, select.value);
    });
});

function guardarDia(dia, recetaId) {
    const menu = JSON.parse(localStorage.getItem("menuSemanal")) || {};

    menu[dia] = {
        recetaId: recetaId || null
    };

    localStorage.setItem("menuSemanal", JSON.stringify(menu));

    mostrarMensaje(`Menú del día ${dia} guardado correctamente.`);
}

/* ============================================================
   CARGAR MENÚ GUARDADO
============================================================ */
function cargarMenuGuardado() {
    const menu = JSON.parse(localStorage.getItem("menuSemanal")) || {};

    Object.entries(menu).forEach(([dia, info]) => {
        const select = document.querySelector(`select[data-dia='${dia}']`);
        if (select) {
            select.value = info.recetaId || "";
        }
    });
}

/* ============================================================
   MENSAJE DE CONFIRMACIÓN
============================================================ */
function mostrarMensaje(texto) {
    const contenedor = document.getElementById("mensajeMenu");

    contenedor.innerHTML = `
        <div class="alert alert-success mt-3">${texto}</div>
    `;

    setTimeout(() => (contenedor.innerHTML = ""), 1800);
}