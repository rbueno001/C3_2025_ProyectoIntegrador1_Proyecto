// ==========================================
// CONFIG
// ==========================================
const API_URL = "http://localhost:3000";

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarListaCompras();
    inicializarBotones();
});

// ==========================================
// CARGAR LISTA: RECETAS INDIVIDUALES + MENÚ SEMANAL
// ==========================================
async function cargarListaCompras() {
    const tabla = document.getElementById("cuerpo-lista-compras") ||
                  document.getElementById("tablaCompras");

    if (!tabla) return;

    tabla.innerHTML = "";

    // Lista desde recetas individuales
    const listaIndividual = JSON.parse(localStorage.getItem("listaCompras")) || [];

    // Lista desde menú semanal
    const menuSemanal = JSON.parse(localStorage.getItem("menuSemanal")) || {};
    const dias = Object.values(menuSemanal).filter(r => r && r.recetaId);

    let listaMenu = [];

    // Cargar ingredientes del menú semanal
    for (const dia in menuSemanal) {
        const recetaId = menuSemanal[dia]?.recetaId;
        if (!recetaId) continue;

        try {
            const res = await fetch(`${API_URL}/recetas/${recetaId}`);
            const receta = await res.json();

            if (Array.isArray(receta.ingredientes)) {
                listaMenu.push(...receta.ingredientes);
            }
        } catch (error) {
            console.error("Error cargando receta del menú:", error);
        }
    }

    // Unir ambas listas
    const listaTotal = [...listaIndividual, ...listaMenu];

    // Si no hay nada que mostrar
    if (listaTotal.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    No hay ingredientes en la lista de compras.
                </td>
            </tr>
        `;
        return;
    }

    // Agrupar ingredientes
    const ingredientesAgrupados = agruparIngredientes(listaTotal);

    // Guardar para ediciones
    window._listaCompras = ingredientesAgrupados;

    // Renderizar tabla
    renderizarTabla();
}

// ==========================================
// AGRUPAR INGREDIENTES REPETIDOS
// ==========================================
function agruparIngredientes(lista) {
    const mapa = {};

    lista.forEach(ing => {
        if (!ing.nombre) return;

        const nombre = ing.nombre.trim().toLowerCase();
        const unidad = ing.unidad || "";
        const key = `${nombre}_${unidad}`;

        if (!mapa[key]) {
            mapa[key] = { nombre: ing.nombre, cantidad: 0, unidad };
        }

        const cantidadNum = parseFloat(ing.cantidad) || 0;
        mapa[key].cantidad += cantidadNum;
    });

    Object.values(mapa).forEach(ing => {
        ing.cantidad = Number(ing.cantidad.toFixed(2));
    });

    return mapa;
}

// ==========================================
// RENDER TABLA
// ==========================================
function renderizarTabla() {
    const tabla = document.getElementById("cuerpo-lista-compras") ||
                  document.getElementById("tablaCompras");

    tabla.innerHTML = "";

    const lista = window._listaCompras;

    if (!lista || Object.keys(lista).length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
                    No hay ingredientes en la lista.
                </td>
            </tr>
        `;
        return;
    }

    Object.entries(lista).forEach(([key, ing]) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${ing.nombre}</td>
            <td>${ing.cantidad}</td>
            <td>${ing.unidad}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarIngrediente('${key}')">
                    ✕
                </button>
            </td>
        `;

        tabla.appendChild(fila);
    });
}

// ==========================================
// ELIMINAR UN INGREDIENTE
// ==========================================
function eliminarIngrediente(key) {
    delete window._listaCompras[key];
    renderizarTabla();
}

// ==========================================
// VACÍAR LISTA COMPLETA
// ==========================================
function inicializarBotones() {
    const btnVaciar = document.getElementById("btnVaciar");

    if (!btnVaciar) return;

    btnVaciar.addEventListener("click", () => {
        // Vaciar ambas listas
        localStorage.removeItem("listaCompras");
        window._listaCompras = {};
        renderizarTabla();
    });
}