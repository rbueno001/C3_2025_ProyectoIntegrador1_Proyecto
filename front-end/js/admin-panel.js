// ===============================
//  RECETAS PENDIENTES DE APROBACIÓN
// ===============================

/**
 * Cargar las recetas en estado "pendiente"
 * Backend:
 *   GET http://localhost:3000/recetas/admin/pendientes
 * Respuesta esperada:
 *   [ { _id, titulo, autor, creadoEn, estado }, ... ]
 */
async function cargarRecetasPendientes() {
  const tablaBody = document.querySelector("#tabla-recetas-pendientes tbody");
  const mensajeVacio = document.getElementById("sin-recetas-pendientes");

  if (!tablaBody) return; // por si esta página no tiene la tabla

  tablaBody.innerHTML = "";
  mensajeVacio.classList.add("d-none");

  try {
    // nueva URL
    const respuesta = await fetch("http://localhost:3000/recetas/admin/pendientes");
    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener las recetas pendientes.");
    }

    // El backend devuelve un ARRAY directo, no { recetas: [...] }
    const data = await respuesta.json();
    const recetas = Array.isArray(data) ? data : (data.recetas || []);

    if (recetas.length === 0) {
      mensajeVacio.classList.remove("d-none");
      return;
    }

    recetas.forEach((receta, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${receta.titulo}</td>
        <td>${receta.autor?.nombre || receta.autorNombre || "Desconocido"}</td>
        <td>${
          receta.creadoEn
            ? new Date(receta.creadoEn).toLocaleString()
            : "—"
        }</td>
        <td>${receta.estado || "pendiente"}</td>
        <td>
          <button class="btn btn-sm btn-success me-1"
                  onclick="aprobarReceta('${receta._id}')">
            Aprobar
          </button>
          <button class="btn btn-sm btn-outline-danger"
                  onclick="rechazarReceta('${receta._id}')">
            Rechazar
          </button>
        </td>
      `;

      tablaBody.appendChild(tr);
    });

  } catch (error) {
    console.error("Error cargando recetas pendientes:", error);
    mensajeVacio.textContent = "No se pudieron cargar las recetas pendientes. Verifica el servidor.";
    mensajeVacio.classList.remove("d-none");
  }
}


/**
 * Aprobar una receta
 * Backend:
 *   PUT /recetas/admin/:id/aprobar
 */
async function aprobarReceta(idReceta) {
  if (!confirm("¿Seguro que deseas aprobar esta receta?")) return;

  try {
    const respuesta = await fetch(`http://localhost:3000/recetas/admin/${idReceta}/aprobar`, {
      method: "PUT"
    });

    if (!respuesta.ok) {
      const data = await respuesta.json().catch(() => ({}));
      alert(data.mensaje || "Error al aprobar la receta.");
      return;
    }

    alert("Receta aprobada correctamente.");
    cargarRecetasPendientes(); // refrescar tabla

  } catch (error) {
    console.error("Error al aprobar receta:", error);
    alert("Error de conexión con el servidor.");
  }
}


/**
 * Rechazar una receta
 * Backend:
 *   PUT /recetas/admin/:id/rechazar
 */
async function rechazarReceta(idReceta) {
  if (!confirm("¿Seguro que deseas rechazar esta receta?")) return;

  try {
    const respuesta = await fetch(`http://localhost:3000/recetas/admin/${idReceta}/rechazar`, {
      method: "PUT"
    });

    if (!respuesta.ok) {
      const data = await respuesta.json().catch(() => ({}));
      alert(data.mensaje || "Error al rechazar la receta.");
      return;
    }

    alert("Receta rechazada correctamente.");
    cargarRecetasPendientes(); // refrescar tabla

  } catch (error) {
    console.error("Error al rechazar receta:", error);
    alert("Error de conexión con el servidor.");
  }
}
