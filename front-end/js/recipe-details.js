// /front-end/js/recipe-details.js

const API_BASE = "http://localhost:3000";

let RECETA_ID = null;          // ID actual de la receta (Mongo)
let USUARIO_ACTUAL = null;     // Usuario logueado (si hay)
let LIKE_ACTIVO = false;       // Si este usuario ya dio like

// -----------------------------------------
// 1. Obtener usuario actual (de login.js)
// -----------------------------------------
function obtenerUsuarioActual() {
  let usuario = null;

  const storedSession = sessionStorage.getItem("usuario");
  const storedLocal = localStorage.getItem("usuario");

  try {
    if (storedSession) usuario = JSON.parse(storedSession);
    else if (storedLocal) usuario = JSON.parse(storedLocal);
  } catch (e) {
    console.warn("No se pudo parsear el usuario almacenado:", e);
  }

  return usuario;
}

// -----------------------------------------
// 2. Cargar cuando el DOM esté listo
// -----------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("👉 recipe-details.js cargado");

  USUARIO_ACTUAL = obtenerUsuarioActual();

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const container = document.getElementById("recipe-container");
  const errorBox = document.getElementById("recipe-error");

  if (!id) {
    console.warn("No se encontró el parámetro 'id' en la URL");
    container.classList.add("d-none");
    errorBox.classList.remove("d-none");
    return;
  }

  // Guardamos el ID globalmente
  RECETA_ID = id;

  // Cargar receta desde el backend
  cargarRecetaDesdeBackend(id)
    .catch((err) => {
      console.error("Error cargando receta:", err);
      container.classList.add("d-none");
      errorBox.classList.remove("d-none");
    });

  // Asignar evento al botón de like (si existe)
  const btnLike = document.getElementById("btn-like");
  if (btnLike) {
    btnLike.addEventListener("click", toggleLikeReceta);
  }
});

// -----------------------------------------
// 3. Traer la receta desde el backend
//    GET /recetas/:id
// -----------------------------------------
async function cargarRecetaDesdeBackend(idReceta) {
  const container = document.getElementById("recipe-container");
  const errorBox = document.getElementById("recipe-error");

  const respuesta = await fetch(`${API_BASE}/recetas/${idReceta}`);

  if (!respuesta.ok) {
    console.error("No se pudo obtener la receta:", respuesta.status);
    container.classList.add("d-none");
    errorBox.classList.remove("d-none");
    return;
  }

  const receta = await respuesta.json();
  console.log("📥 Receta recibida:", receta);

  // Si la receta no está aprobada, opcionalmente podrías bloquearla
  if (receta.estado && receta.estado !== "aprobada") {
    console.warn("La receta no está aprobada:", receta.estado);
  }

  renderRecetaEnPantalla(receta);
}

// -----------------------------------------
// 4. Pintar la receta en el HTML
// -----------------------------------------
function renderRecetaEnPantalla(receta) {
  // Imagen principal (si en el futuro agregan receta.imagenUrl o similar)
  const img = document.getElementById("recipe-image");
  if (img) {
    // Usamos una imagen por defecto si no hay ninguna URL
    const imagenUrl =
      receta.imagenPrincipalUrl ||
      receta.imagenUrl ||
      "/imgs/quequedenaranja.png"; // cámbiala por un placeholder tuyo
    img.src = imagenUrl;
    img.alt = receta.titulo || "Receta";
  }

  // Título
  const titleEl = document.getElementById("recipe-title");
  if (titleEl) titleEl.textContent = receta.titulo || "Receta sin título";

  // Autor
  const authorEl = document.getElementById("recipe-author");
  if (authorEl) {
    // si el backend populó "autor"
    if (receta.autor && typeof receta.autor === "object") {
      authorEl.textContent = receta.autor.nombre || receta.autor.nombreUsuario || "Autor desconocido";
    } else {
      authorEl.textContent = "Autor desconocido";
    }
  }

  // Tipo (categoría)
  const typeEl = document.getElementById("recipe-type");
  if (typeEl) {
    typeEl.textContent = receta.tipo || "Sin categoría";
  }

  // Dificultad (no está en el modelo, así que dejamos algo genérico)
  const difficultyEl = document.getElementById("recipe-difficulty");
  if (difficultyEl) {
    difficultyEl.textContent = receta.dificultad || "Media";
  }

  // Ocasión
  const occasionEl = document.getElementById("recipe-occasion");
  if (occasionEl) {
    occasionEl.textContent = receta.ocasion || "Cualquier ocasión";
  }

  // Descripción
  const descEl = document.getElementById("recipe-description");
  if (descEl) {
    descEl.textContent = receta.descripcion || "Sin descripción.";
  }

  // Tiempo total
  const timeEl = document.getElementById("recipe-time");
  if (timeEl) {
    if (receta.tiempoPreparacionMin) {
      timeEl.textContent = `${receta.tiempoPreparacionMin} minutos`;
    } else {
      timeEl.textContent = "—";
    }
  }

  // Porciones
  const servingsEl = document.getElementById("recipe-servings");
  if (servingsEl) {
    if (receta.porciones) {
      servingsEl.textContent = `${receta.porciones} porciones`;
    } else {
      servingsEl.textContent = "—";
    }
  }

  // Ingredientes
  const ingList = document.getElementById("recipe-ingredients");
  if (ingList) {
    if (Array.isArray(receta.ingredientes) && receta.ingredientes.length > 0) {
      ingList.innerHTML = receta.ingredientes
        .map((ing) => {
          const cantidad = ing.cantidad ?? "";
          const unidad = ing.unidad ?? "";
          const nombre = ing.nombre ?? "";
          const texto = `${cantidad} ${unidad} ${nombre}`.trim();
          return `<li>• ${texto}</li>`;
        })
        .join("");
    } else {
      ingList.innerHTML = "<li>No hay ingredientes registrados.</li>";
    }
  }

  // Pasos
  const stepsList = document.getElementById("recipe-steps");
  if (stepsList) {
    if (Array.isArray(receta.pasos) && receta.pasos.length > 0) {
      stepsList.innerHTML = receta.pasos
        .map((paso, idx) => {
          const texto = paso.instruccion || paso.descripcion || "";
          return `<li><strong>Paso ${idx + 1}:</strong> ${texto}</li>`;
        })
        .join("");
    } else {
      stepsList.innerHTML = "<li>No hay pasos registrados.</li>";
    }
  }

  // Likes
  const countEl = document.getElementById("recipe-likes-count");
  const btnLike = document.getElementById("btn-like");

  const likes = Array.isArray(receta.likes) ? receta.likes : [];
  const totalLikes = likes.length;

  if (countEl) {
    countEl.textContent = totalLikes;
  }

  // Ver si este usuario ya dio like
  LIKE_ACTIVO = false;
  if (USUARIO_ACTUAL) {
    const userId = (USUARIO_ACTUAL.id || USUARIO_ACTUAL._id || "").toString();
    LIKE_ACTIVO = likes.some((idLike) => idLike.toString() === userId);
  }

  // Cambiar estilo del botón según LIKE_ACTIVO
  if (btnLike) {
    if (LIKE_ACTIVO) {
      btnLike.classList.remove("btn-outline-danger");
      btnLike.classList.add("btn-danger");
    } else {
      btnLike.classList.add("btn-outline-danger");
      btnLike.classList.remove("btn-danger");
    }
  }
}

// -----------------------------------------
// 5. Dar / quitar like (toggle)
//    PUT /recetas/:id/like
// -----------------------------------------
async function toggleLikeReceta() {
  if (!RECETA_ID) {
    console.error("No hay RECETA_ID definido.");
    return;
  }

  // Verificar login
  const usuario = obtenerUsuarioActual();
  if (!usuario) {
    alert("Debes iniciar sesión para dar like.");
    window.location.href = "/front-end/login.html";
    return;
  }

  const usuarioId = usuario.id || usuario._id;
  if (!usuarioId) {
    alert("Error con la sesión de usuario.");
    return;
  }

  const btnLike = document.getElementById("btn-like");
  const countEl = document.getElementById("recipe-likes-count");

  try {
    const respuesta = await fetch(`${API_BASE}/recetas/${RECETA_ID}/like`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuarioId })
    });

    const data = await respuesta.json();
    console.log("📥 Respuesta like:", data);

    if (!respuesta.ok) {
      alert(data.mensaje || "Error al registrar el like.");
      return;
    }

    // Actualizar contador
    if (countEl && typeof data.likesTotales === "number") {
      countEl.textContent = data.likesTotales;
    }

    // Actualizar estado local
    LIKE_ACTIVO = data.likeActivo;

    // Cambiar estilo del botón
    if (btnLike) {
      if (LIKE_ACTIVO) {
        btnLike.classList.remove("btn-outline-danger");
        btnLike.classList.add("btn-danger");
      } else {
        btnLike.classList.add("btn-outline-danger");
        btnLike.classList.remove("btn-danger");
      }
    }

  } catch (error) {
    console.error("Error al hacer like:", error);
    alert("Error de conexión con el servidor.");
  }
}
