// URL base del backend
const API_BASE = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  console.log("👉 pagina-principal.js cargado");
  cargarRecetasEnPortada();
});

/**
 * Llama al backend y carga las recetas aprobadas en la sección
 * "Recetas más populares" de la página principal.
 *
 * Usa el endpoint:
 *   GET /recetas
 * que en tu backend ya está filtrando por estado: "aprobada".
 */
async function cargarRecetasEnPortada() {
  const contenedor = document.getElementById("lista-recetas");
  const mensajeBox = document.getElementById("mensaje-recetas");

  if (!contenedor) {
    console.warn("No se encontró el contenedor #lista-recetas");
    return;
  }

  // Limpiar contenido previo
  contenedor.innerHTML = "";
  if (mensajeBox) mensajeBox.classList.add("d-none");

  try {
    const resp = await fetch(`${API_BASE}/recetas`);
    if (!resp.ok) {
      throw new Error("No se pudieron obtener las recetas");
    }

    const recetas = await resp.json();
    console.log("📥 Recetas desde backend:", recetas);

    // Si no hay recetas
    if (!Array.isArray(recetas) || recetas.length === 0) {
      if (mensajeBox) {
        mensajeBox.textContent = "";
        mensajeBox.innerHTML = `
          <div class="alert alert-warning">
            No hay recetas para mostrar por el momento.
          </div>
        `;
        mensajeBox.classList.remove("d-none");
      }
      return;
    }

    // Construir cards
    recetas.forEach((receta) => {
      const col = document.createElement("div");
      col.classList.add("col");

      // Imagen: intenta usar un campo del backend y si no, un placeholder
      const imagenUrl =
        receta.imagenPrincipalUrl ||
        receta.imagenUrl ||
        "/imgs/quequedenaranja.png";

      // Tiempo
      const tiempo = receta.tiempoPreparacionMin
        ? `${receta.tiempoPreparacionMin} min`
        : "Tiempo no especificado";

      // Tipo / categoría / ocasión (por si luego agregan en el modelo)
      const tipo = receta.tipo || receta.categoria || "Sin categoría";
      const ocasion = receta.ocasion || "Cualquier ocasión";

      // Likes: longitud del array de usuarios que han dado like
      const totalLikes = Array.isArray(receta.likes)
        ? receta.likes.length
        : 0;

      // Card de la receta
      col.innerHTML = `
        <a href="/front-end/detalle-receta.html?id=${receta._id}" class="text-decoration-none">
          <div class="card shadow-sm h-100">
            <img src="${imagenUrl}"
                 class="card-img-top fixed-img"
                 alt="${receta.titulo || "Receta"}">

            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-dark">
                ${receta.titulo || "Receta sin título"}
              </h5>

              <p class="card-text text-muted small mb-2">
                ${
                  receta.descripcion
                    ? receta.descripcion.length > 90
                      ? receta.descripcion.substring(0, 90) + "..."
                      : receta.descripcion
                    : "Sin descripción."
                }
              </p>

              <div class="mb-2 small">
                <span class="badge bg-secondary me-1">${tipo}</span>
                <span class="badge bg-info text-dark">${ocasion}</span>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-auto">
                <span class="small text-muted">
                  ⏱ ${tiempo}
                </span>
                <span class="small">
                  ❤️ ${totalLikes}
                </span>
              </div>
            </div>
          </div>
        </a>
      `;

      contenedor.appendChild(col);
    });

  } catch (error) {
    console.error("Error cargando recetas:", error);

    if (mensajeBox) {
      mensajeBox.textContent = "";
      mensajeBox.innerHTML = `
        <div class="alert alert-danger">
          Ocurrió un error al cargar las recetas. Verifica que el servidor esté encendido.
        </div>
      `;
      mensajeBox.classList.remove("d-none");
    }
  }
}
