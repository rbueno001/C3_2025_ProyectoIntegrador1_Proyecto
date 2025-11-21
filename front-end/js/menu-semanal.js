/* ============================================
   MENÚ SEMANAL
   – Permite seleccionar una receta por día
   – Guarda el plan en localStorage
   – Se usa luego en lista-compras.html
============================================ */

const DIAS_SEMANA = [
    "Lunes", "Martes", "Miércoles",
    "Jueves", "Viernes", "Sábado", "Domingo"
];

let recetasDisponibles = [];

/* Cargar recetas desde el backend para las listas desplegables */
async function cargarRecetasParaMenu() {
    try {
        const respuesta = await fetch("http://localhost:3000/recetas");
        const datos = await respuesta.json();
        recetasDisponibles = datos || [];
        construirTablaMenu();
    } catch (error) {
        console.error("Error al cargar recetas para menú:", error);
    }
}

/* Construir la tabla con un select por día */
function construirTablaMenu() {
    const cuerpo = document.getElementById("tabla-menu");
    cuerpo.innerHTML = "";

    DIAS_SEMANA.forEach((dia, indice) => {
        const fila = document.createElement("tr");

        const celdaDia = document.createElement("td");
        celdaDia.textContent = dia;

        const celdaSelect = document.createElement("td");
        const select = document.createElement("select");
        select.classList.add("form-select", "input-custom");
        select.dataset.diaIndex = indice;

        const opcionVacia = document.createElement("option");
        opcionVacia.value = "";
        opcionVacia.textContent = "Seleccione una receta...";
        select.appendChild(opcionVacia);

        recetasDisponibles.forEach(r => {
            const op = document.createElement("option");
            op.value = r._id;
            op.textContent = r.titulo;
            select.appendChild(op);
        });

        celdaSelect.appendChild(select);

        fila.appendChild(celdaDia);
        fila.appendChild(celdaSelect);
        cuerpo.appendChild(fila);
    });

    cargarMenuGuardado();
}

/* Guardar menú semanal en localStorage */
document.getElementById("btn-guardar-menu").addEventListener("click", () => {
    const semanaTexto = document.getElementById("semanaTexto").value || "";
    const selects = document.querySelectorAll("#tabla-menu select");

    const menu = {
        semanaTexto,
        dias: []
    };

    selects.forEach((sel, idx) => {
        menu.dias.push({
            dia: DIAS_SEMANA[idx],
            recetaId: sel.value || null
        });
    });

    localStorage.setItem("menuSemanal", JSON.stringify(menu));

    const mensaje = document.getElementById("mensaje-menu");
    mensaje.innerHTML = `
        <div class="alert alert-success mt-2">
            Menú semanal guardado correctamente.
        </div>
    `;
});

/* Cargar menú guardado si existe */
function cargarMenuGuardado() {
    const menuGuardado = localStorage.getItem("menuSemanal");
    if (!menuGuardado) return;

    const menu = JSON.parse(menuGuardado);
    document.getElementById("semanaTexto").value = menu.semanaTexto || "";

    const selects = document.querySelectorAll("#tabla-menu select");

    menu.dias.forEach((item, idx) => {
        if (selects[idx]) {
            selects[idx].value = item.recetaId || "";
        }
    });
}

/* Inicialización */
document.addEventListener("DOMContentLoaded", cargarRecetasParaMenu);