/* ============================================================
   REGISTRAR RECETA
   Envía datos + imágenes con FormData al backend
============================================================ */

const API_BASE = "http://localhost:3000";

/* Obtener usuario activo */
function obtenerUsuarioActual() {
  const uStr = sessionStorage.getItem("usuario") || localStorage.getItem("usuario");
  if (!uStr) return null;

  const s = sessionStorage.getItem("usuario");
  const l = localStorage.getItem("usuario");

  try {
    if (s) usuario = JSON.parse(s);
    else if (l) usuario = JSON.parse(l);
  } catch (e) {
    console.warn("Usuario inválido:", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const usuario = obtenerUsuarioActual();

  /* Si no hay usuario logueado */
  if (!usuario) {
    alert("Debes iniciar sesión para registrar una receta.");
    window.location.href = "/front-end/login.html";
    return;
  }

  const form = document.getElementById("formReceta");
  const contIng = document.getElementById("contenedorIngredientes");
  const contPasos = document.getElementById("contenedorPasos");
  const btnIng = document.getElementById("btnAgregarIngrediente");
  const btnPaso = document.getElementById("btnAgregarPaso");
  const msgBox = document.getElementById("mensaje-receta");

  /* Agregar ingrediente */
  btnIng.addEventListener("click", () => {
    const fila = document.createElement("div");
    fila.classList.add("row", "g-2", "mb-2", "ingrediente-item");

    fila.innerHTML = `
      <div class="col-12 col-md-5">
        <input type="text" class="form-control input-custom ingrediente-nombre"
        placeholder="Ingrediente" required>
      </div>

      <div class="col-12 col-md-3">
        <input type="number" class="form-control input-custom ingrediente-cantidad"
        placeholder="Cantidad" step="0.01" min="0" required>
      </div>

      <div class="col-12 col-md-3">
        <select class="form-select input-custom ingrediente-unidad" required>
          <option value="">Seleccione la medida</option>
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="l">l</option>
          <option value="cucharadita(s)">cucharadita(s)</option>
          <option value="cucharada(s)">cucharada(s)</option>
          <option value="taza(s)">taza(s)</option>
          <option value="unidad(es)">unidad(es)</option>
        </select>
      </div>

      <div class="col-12 col-md-1 d-flex align-items-center">
        <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-ing">X</button>
      </div>
    `;

    contIng.appendChild(fila);
    fila.querySelector(".btn-eliminar-ing").addEventListener("click", () => fila.remove());
  });

  /* Agregar paso */
  btnPaso.addEventListener("click", () => {
    const paso = document.createElement("div");
    paso.classList.add("mb-3", "paso-item");

    paso.innerHTML = `
      <textarea class="form-control input-custom paso-instruccion"
      placeholder="Describa el paso" required></textarea>

      <input type="file" class="form-control mt-2 paso-media"
      accept="image/*,video/*">

      <button type="button" class="btn btn-sm btn-outline-danger mt-2 btn-eliminar-paso">
        Eliminar paso
      </button>
    `;

    contPasos.appendChild(paso);
    paso.querySelector(".btn-eliminar-paso").addEventListener("click", () => paso.remove());
  });

  /* Enviar datos */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msgBox.innerHTML = "";

    const fd = new FormData();

    /* ID del autor */
    const autorId = usuario.id || usuario._id;

    if (!autorId) {
      alert("Error con el usuario. Inicia sesión nuevamente.");
      return;
    }

    /* Campos base */
    const titulo = document.getElementById("nombreReceta").value.trim();
    const autorManual = document.getElementById("autorNombre").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const descripcion = document.getElementById("descripcionReceta").value.trim();
    const costo = document.getElementById("presupuestoPorPorcion").value.trim();
    const tiempo = document.getElementById("tiempoPreparacion").value.trim();
    const porciones = document.getElementById("porciones").value.trim();

    if (!titulo || !categoria || !descripcion) {
      msgBox.innerHTML =
        `<div class="alert alert-danger">Complete los campos obligatorios.</div>`;
      return;
    }

    /* Foto principal obligatoria */
    const fotoPrincipal = document.getElementById("fotoPrincipal").files[0];

    if (!fotoPrincipal) {
      msgBox.innerHTML =
        `<div class="alert alert-danger">Debe agregar una foto principal.</div>`;
      return;
    }

    fd.append("fotoPrincipal", fotoPrincipal);
    fd.append("titulo", titulo);
    fd.append("autorNombre", autorManual);
    fd.append("descripcion", descripcion);
    fd.append("tipo", categoria);
    fd.append("autorId", autorId);
    fd.append("presupuestoPorPorcion", costo || 0);
    fd.append("tiempoPreparacionMin", tiempo || 0);
    fd.append("porciones", porciones || 0);

    /* Ingredientes */
    const ingredientes = [];
    document.querySelectorAll(".ingrediente-item").forEach((item) => {
      const nombre = item.querySelector(".ingrediente-nombre").value.trim();
      const cantidad = item.querySelector(".ingrediente-cantidad").value;
      const unidad = item.querySelector(".ingrediente-unidad").value;

      if (nombre && cantidad && unidad) {
        ingredientes.push({ nombre, cantidad: Number(cantidad), unidad });
      }
    });

    if (ingredientes.length === 0) {
      msgBox.innerHTML =
        `<div class="alert alert-danger">Agregue al menos un ingrediente.</div>`;
      return;
    }

    fd.append("ingredientes", JSON.stringify(ingredientes));

    /* Pasos */
    const pasos = [];
    document.querySelectorAll(".paso-item").forEach((item, index) => {
      const instruccion = item.querySelector(".paso-instruccion").value.trim();
      const archivo = item.querySelector(".paso-media").files[0];

      if (instruccion) {
        pasos.push({
          instruccion,
          mediaIndex: archivo ? index : null
        });

        if (archivo) {
          fd.append("pasoMedia", archivo); // multer recibe varios
        }
      }
    });

    if (pasos.length === 0) {
      msgBox.innerHTML =
        `<div class="alert alert-danger">Agregue al menos un paso.</div>`;
      return;
    }

    fd.append("pasos", JSON.stringify(pasos));

    /* Enviar */
    try {
      const res = await fetch(`${API_BASE}/recetas`, {
        method: "POST",
        body: fd
      });

      const data = await res.json();

      if (!res.ok) {
        msgBox.innerHTML =
          `<div class="alert alert-danger">${data.mensaje || "Error al registrar."}</div>`;
        return;
      }

      msgBox.innerHTML =
        `<div class="alert alert-success">
          Receta registrada correctamente. Pendiente de aprobación.
        </div>`;

      form.reset();

    } catch (err) {
      msgBox.innerHTML =
        `<div class="alert alert-danger">Error de conexión con el servidor.</div>`;
    }
  });

  // ➕ Ingredientes dinámicos
  const btnAgregarIngrediente = document.getElementById("btnAgregarIngrediente");
  if (btnAgregarIngrediente) {
    btnAgregarIngrediente.addEventListener("click", () => {
      const cont = document.getElementById("contenedorIngredientes");
      cont.insertAdjacentHTML("beforeend", `
        <div class="row g-2 mb-2 ingrediente-item">
          <div class="col-12 col-md-5">
            <input type="text" class="form-control input-custom" placeholder="Ingrediente" required>
          </div>
          <div class="col-12 col-md-3">
            <input type="number" class="form-control input-custom" placeholder="Cantidad" min="0" step="0.01" required>
          </div>
          <div class="col-12 col-md-3">
            <select class="form-select input-custom" required>
              <option value="" disabled selected>Unidad</option>
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="ml">ml</option>
              <option value="l">l</option>
              <option value="cucharadita">Cucharadita</option>
              <option value="cucharada">Cucharada</option>
              <option value="taza">Taza</option>
              <option value="unidad">Unidad</option>
            </select>
          </div>
        </div>
      `);
    });
  }

  // ➕ Pasos dinámicos
  const btnAgregarPaso = document.getElementById("btnAgregarPaso");
  if (btnAgregarPaso) {
    btnAgregarPaso.addEventListener("click", () => {
      const cont = document.getElementById("contenedorPasos");
      cont.insertAdjacentHTML("beforeend", `
        <div class="mb-3 paso-item">
          <textarea class="form-control input-custom" placeholder="Describa el paso" required></textarea>
        </div>
      `);
    });
  }
});