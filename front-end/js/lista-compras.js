/* ============================================
   LISTA DE COMPRAS
   – Lee el menú semanal desde localStorage
   – Consulta las recetas seleccionadas
   – Agrupa ingredientes (nombre + unidad)
============================================ */

async function generarListaCompras() {
    const contLista = document.getElementById("lista-compras");
    const infoSemana = document.getElementById("info-semana");
    const mensajeLista = document.getElementById("mensaje-lista");

    contLista.innerHTML = "";
    infoSemana.textContent = "";
    mensajeLista.innerHTML = "";

    const menuGuardado = localStorage.getItem("menuSemanal");

    if (!menuGuardado) {
        mensajeLista.innerHTML = `
            <div class="alert alert-warning mt-2">
                No hay un menú semanal guardado. Vuelva al planificador y configure el menú.
            </div>
        `;
        return;
    }

    const menu = JSON.parse(menuGuardado);
    infoSemana.textContent = menu.semanaTexto || "Menú sin descripción.";

    // Obtener todos los IDs de receta seleccionados
    const idsRecetas = menu.dias
        .map(d => d.recetaId)
        .filter(id => id); // quitar nulos o vacíos

    if (!idsRecetas.length) {
        mensajeLista.innerHTML = `
            <div class="alert alert-info mt-2">
                El menú semanal no tiene recetas seleccionadas.
            </div>
        `;
        return;
    }

    // Cargar cada receta y acumular ingredientes
    const mapaIngredientes = {}; // clave: nombre + unidad

    for (const id of idsRecetas) {
        try {
            const res = await fetch(`http://localhost:3000/recetas/${id}`);
            const receta = await res.json();

            (receta.ingredientes || []).forEach(ing => {
                const clave = `${ing.nombre.toLowerCase()}|${ing.unidad}`;
                if (!mapaIngredientes[clave]) {
                    mapaIngredientes[clave] = {
                        nombre: ing.nombre,
                        unidad: ing.unidad,
                        cantidad: parseFloat(ing.cantidad) || 0
                    };
                } else {
                    mapaIngredientes[clave].cantidad += parseFloat(ing.cantidad) || 0;
                }
            });

        } catch (error) {
            console.error("Error al cargar receta para lista de compras:", error);
        }
    }

    // Mostrar lista agrupada
    const claves = Object.keys(mapaIngredientes);
    if (!claves.length) {
        mensajeLista.innerHTML = `
            <div class="alert alert-info mt-2">
                No se encontraron ingredientes en las recetas seleccionadas.
            </div>
        `;
        return;
    }

    claves.forEach(clave => {
        const item = mapaIngredientes[clave];
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        li.innerHTML = `
            <span>${item.nombre}</span>
            <span class="badge bg-dark rounded-pill">
                ${item.cantidad} ${item.unidad}
            </span>
        `;

        contLista.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", generarListaCompras);