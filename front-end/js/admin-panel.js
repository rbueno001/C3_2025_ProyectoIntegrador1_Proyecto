// /front-end/js/admin.js

// Asegúrate de que auth.js se cargue ANTES de este archivo en el HTML

document.addEventListener("DOMContentLoaded", () => {
  const usuario = obtenerUsuarioActual();

  // Si no hay usuario logueado, fuera del panel admin
  if (!usuario) {
    window.location.href = "/front-end/login.html";
    return;
  }

  // --- Manejo de navbar en admin.html ---
  const navLogin  = document.getElementById("navLogin");
  const navLogout = document.getElementById("navLogout");
  const navPerfil = document.getElementById("navPerfil");
  const navAdmin  = document.getElementById("navAdmin");

  if (navLogin)  navLogin.classList.add("d-none");
  if (navPerfil) navPerfil.classList.remove("d-none");
  if (navLogout) {
    navLogout.classList.remove("d-none");
    const btn = navLogout.querySelector("button");
    if (btn) btn.addEventListener("click", cerrarSesion);
  }

  // Solo los admins pueden estar aquí
  if (usuario.rol !== "admin") {
    // Opcional: podrías mostrar un mensaje en vez de redirigir
    window.location.href = "/front-end/pagina-principal.html";
    return;
  }

  if (navAdmin) navAdmin.classList.remove("d-none");

  // Cargar datos del panel
  cargarRecetasPendientes();
  // (si luego quieren, aquí llaman a cargarMétricas, cargarReportes, etc.)
});

// ===============================
//  RECETAS PENDIENTES DE APROBACIÓN
// ===============================
async function cargarRecetasPendientes() {
  const tablaBody   = document.querySelector("#tabla-recetas-pendientes tbody");
  const mensajeVacio = document.getElementById("sin-recetas-pendientes");

  if (!tablaBody) return;

  tablaBody.innerHTML = "";
  mensajeVacio.classList.add("d-none");

  try {
    // IMPORTANTE: esta URL coincide con tu backend
    const respuesta = await fetch("http://localhost:3000/recetas/admin/pendientes");

    if (!respuesta.ok) {
      throw new Error("No se pudieron obtener las recetas pendientes.");
    }

    const data = await respuesta.json();
    console.log("👉 Recetas pendientes recibidas en admin.js:", data);

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
        <td>${receta.autor?.nombre || "Desconocido"}</td>
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
    mensajeVacio.textContent =
      "No se pudieron cargar las recetas pendientes. Verifica el servidor.";
    mensajeVacio.classList.remove("d-none");
  }
}

// Aprobar receta
async function aprobarReceta(idReceta) {
  if (!confirm("¿Seguro que deseas aprobar esta receta?")) return;

  try {
    const respuesta = await fetch(`http://localhost:3000/recetas/admin/${idReceta}/aprobar`, {
      method: "PUT",
    });

    const data = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      alert(data.mensaje || "Error al aprobar la receta.");
      return;
    }

    alert("Receta aprobada correctamente.");
    cargarRecetasPendientes();

  } catch (error) {
    console.error("Error al aprobar receta:", error);
    alert("Error de conexión con el servidor.");
  }
}

// Rechazar receta
async function rechazarReceta(idReceta) {
  if (!confirm("¿Seguro que deseas rechazar esta receta?")) return;

  try {
    const respuesta = await fetch(`http://localhost:3000/recetas/admin/${idReceta}/rechazar`, {
      method: "PUT",
    });

    const data = await respuesta.json().catch(() => ({}));

    if (!respuesta.ok) {
      alert(data.mensaje || "Error al rechazar la receta.");
      return;
    }

    alert("Receta rechazada correctamente.");
    cargarRecetasPendientes();

  } catch (error) {
    console.error("Error al rechazar receta:", error);
    alert("Error de conexión con el servidor.");
  }
}
