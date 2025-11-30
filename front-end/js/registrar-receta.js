// /front-end/js/registrar-receta.js

const API_BASE = "http://localhost:3000";

/// =====================================
///  Obtener usuario actual (login.js)
/// =====================================
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

/// =====================================
///  DOM listo
/// =====================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("👉 registrar-receta.js cargado");

  const usuario = obtenerUsuarioActual();

  // Si no hay usuario, que vaya a login
  if (!usuario) {
    alert("Debes iniciar sesión para registrar una receta.");
    window.location.href = "/front-end/login.html";
    return;
  }

  const form = document.getElementById("formReceta");
  const contIng = document.getElementById("contenedorIngredientes");
  const contPasos = document.getElementById("contenedorPasos");
  const btnAgregarIng = document.getElementById("btnAgregarIngrediente");
  const btnAgregarPaso = document.getElementById("btnAgregarPaso");
  const mensajeBox = document.getElementById("mensaje-receta");

  /// =========================
  ///  Agregar nuevo ingrediente
  /// =========================
  btnAgregarIng.addEventListener("click", () => {
    const fila = document.createElement("div");
    fila.classList.add("row", "g-2", "mb-2", "ingrediente-item");

    fila.innerHTML = `
      <div class="col-12 col-md-5">
        <input
          type="text"
          class="form-control input-custom ingrediente-nombre"
          placeholder="Ingrediente"
          required
        >
      </div>

      <div class="col-12 col-md-3">
        <input
          type="number"
          class="form-control input-custom ingrediente-cantidad"
          placeholder="Cantidad"
          min="0"
          step="0.01"
          required
        >
      </div>

      <div class="col-12 col-md-3">
        <select class="form-select input-custom ingrediente-unidad" required>
          <option value="">Unidad</option>
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

      <div class="col-12 col-md-1 d-flex align-items-center">
        <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-ing">
          X
        </button>
      </div>
    `;

    contIng.appendChild(fila);

    // Botón para eliminar ese ingrediente
    const btnEliminar = fila.querySelector(".btn-eliminar-ing");
    btnEliminar.addEventListener("click", () => fila.remove());
  });

  /// =========================
  ///  Agregar nuevo paso
  /// =========================
  btnAgregarPaso.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("mb-3", "paso-item");

    div.innerHTML = `
      <textarea
        class="form-control input-custom paso-instruccion"
        placeholder="Describa el paso"
        required
      ></textarea>
      <input
        type="file"
        accept="video/*"
        class="form-control mt-2 paso-video"
      >
      <button type="button" class="btn btn-sm btn-outline-danger mt-2 btn-eliminar-paso">
        Eliminar paso
      </button>
    `;

    contPasos.appendChild(div);

    // Botón para eliminar ese paso
    const btnEliminarPaso = div.querySelector(".btn-eliminar-paso");
    btnEliminarPaso.addEventListener("click", () => div.remove());
  });

  /// =========================
  ///  Enviar receta al backend
  /// =========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (mensajeBox) mensajeBox.innerHTML = "";

    // ID del autor (usuario logueado)
    const autorId = usuario.id || usuario._id;

    if (!autorId) {
      alert("Debes iniciar sesión para registrar una receta.");
      window.location.href = "/front-end/login.html";
      return;
    }

    // Campos básicos
    const titulo = document.getElementById("nombreReceta").value.trim();
    const categoria = document.getElementById("categoria").value.trim(); // se mapeará a 'tipo'
    const ocasion = document.getElementById("ocasion")?.value.trim() || "";
    const descripcion =
      document.getElementById("descripcionReceta")?.value.trim() || "";

    const tiempoPreparacion = parseInt(
      document.getElementById("tiempoPreparacion")?.value || "0",
      10
    );
    const presupuestoPorPorcion = parseFloat(
      document.getElementById("presupuestoPorPorcion")?.value || "0"
    );
    const porciones = parseInt(
      document.getElementById("porciones")?.value || "0",
      10
    );

    // Validación sencilla
    if (!titulo || !categoria || !ocasion || !descripcion || !tiempoPreparacion) {
      const msg = "Por favor completa título, categoría, ocasión, descripción y tiempo.";
      if (mensajeBox) {
        mensajeBox.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
      } else {
        alert(msg);
      }
      return;
    }

    // Ingredientes
    const ingredienteItems = document.querySelectorAll(
      "#contenedorIngredientes .ingrediente-item"
    );
    const ingredientes = [];

    ingredienteItems.forEach((item) => {
      const nombreIng =
        item.querySelector(".ingrediente-nombre")?.value.trim() ||
        item.querySelector("input[placeholder='Ingrediente']")?.value.trim();

      const cantidadStr =
        item.querySelector(".ingrediente-cantidad")?.value ||
        item.querySelector("input[placeholder='Cantidad']")?.value;

      const unidad =
        item.querySelector(".ingrediente-unidad")?.value ||
        item.querySelector("select")?.value;

      if (nombreIng && cantidadStr && unidad) {
        ingredientes.push({
          nombre: nombreIng,
          cantidad: parseFloat(cantidadStr),
          unidad,
          // costoEstimado: 0 // si luego se utiliza
        });
      }
    });

    if (ingredientes.length === 0) {
      const msg = "Agrega al menos un ingrediente.";
      if (mensajeBox) {
        mensajeBox.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
      } else {
        alert(msg);
      }
      return;
    }

    // Pasos
    const pasoItems = document.querySelectorAll("#contenedorPasos .paso-item");
    const pasos = [];

    pasoItems.forEach((item) => {
      const instruccion =
        item.querySelector(".paso-instruccion")?.value.trim() ||
        item.querySelector("textarea")?.value.trim();

      if (instruccion) {
        pasos.push({
          instruccion,
          imagenUrl: "",
          videoUrl: "" // por ahora no se suben videos, solo reservamos el campo
        });
      }
    });

    if (pasos.length === 0) {
      const msg = "Agrega al menos un paso.";
      if (mensajeBox) {
        mensajeBox.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
      } else {
        alert(msg);
      }
      return;
    }

    // Objeto que espera el backend según receta.route.js
    const payload = {
      titulo,
      descripcion,
      ingredientes,
      pasos,
      presupuestoPorPorcion: isNaN(presupuestoPorPorcion)
        ? 0
        : presupuestoPorPorcion,
      tiempoPreparacionMin: tiempoPreparacion,
      autorId,
      tipo: categoria, // mapeamos categoría a 'tipo'
      ocasion,
      porciones: isNaN(porciones) ? undefined : porciones
    };

    console.log("📤 Enviando receta al backend:", payload);

    try {
      const respuesta = await fetch(`${API_BASE}/recetas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const resultado = await respuesta.json();
      console.log("📥 Respuesta backend:", resultado);

      if (!respuesta.ok) {
        const msg =
          resultado.mensaje ||
          resultado.mensajeError ||
          "No se pudo registrar la receta.";
        if (mensajeBox) {
          mensajeBox.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
        } else {
          alert(msg);
        }
        return;
      }

      // Éxito
      const msgOk =
        "Receta registrada correctamente. Queda pendiente de aprobación por el administrador.";
      if (mensajeBox) {
        mensajeBox.innerHTML = `<div class="alert alert-success">${msgOk}</div>`;
      } else {
        alert(msgOk);
      }

      // Limpiar formulario
      form.reset();
      contIng.innerHTML = "";
      contPasos.innerHTML = "";

      // Volver a agregar un ingrediente y un paso base
      btnAgregarIng.click();
      btnAgregarPaso.click();

    } catch (error) {
      console.error("Error al guardar receta:", error);
      const msg = "Error de conexión con el servidor.";
      if (mensajeBox) {
        mensajeBox.innerHTML = `<div class="alert alert-danger">${msg}</div>`;
      } else {
        alert(msg);
      }
    }
  });
});
