// /front-end/js/registrar-receta.js

// 🧠 Función auxiliar para obtener el usuario logueado
function obtenerUsuarioActual() {
  const uStr = sessionStorage.getItem("usuario") || localStorage.getItem("usuario");
  if (!uStr) return null;

  try {
    return JSON.parse(uStr);
  } catch {
    return null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formReceta");
  if (!form) return;

  // 1️⃣ Verificar usuario logueado apenas carga la página
  const usuario = obtenerUsuarioActual();
  if (!usuario) {
    alert("Debes iniciar sesión para registrar una receta.");
    window.location.href = "/front-end/login.html";
    return;
  }

  // 2️⃣ Manejar envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuarioActual = obtenerUsuarioActual();
    if (!usuarioActual) {
      alert("La sesión expiró. Inicia sesión de nuevo.");
      window.location.href = "/front-end/login.html";
      return;
    }

    const autorId = usuarioActual.id; // 🔑 id que viene del backend

    // 🌮 Campos básicos
    const titulo = document.getElementById("nombreReceta").value.trim();
    const categoriaSelect = document.getElementById("categoria");
    const categoria = categoriaSelect ? categoriaSelect.value : "";

    // Descripción (si existe el campo en el HTML)
    const descInput = document.getElementById("descripcionReceta");
    const descripcion = descInput ? descInput.value.trim() : "";

    // Ocasión (si existe el select en el HTML)
    const ocasionSelect = document.getElementById("ocasion");
    const ocasion = ocasionSelect ? ocasionSelect.value : "";

    // Tiempo de preparación (minutos) – opcional
    const tiempoInput = document.getElementById("tiempoPrep");
    let tiempoPreparacionMin = null;
    if (tiempoInput && tiempoInput.value !== "") {
      tiempoPreparacionMin = Number(tiempoInput.value);
    }

    // Presupuesto por porción – opcional
    const presupuestoInput = document.getElementById("presupuestoPorPorcion");
    let presupuestoPorPorcion = null;
    if (presupuestoInput && presupuestoInput.value !== "") {
      presupuestoPorPorcion = Number(presupuestoInput.value);
    }

    // URL de imagen local (ej: "/imgs/mi-receta.jpg") – opcional
    const imgInput = document.getElementById("imagenUrl");
    const imagenUrl = imgInput ? imgInput.value.trim() : "";

    // ✅ Validaciones mínimas de front
    if (!titulo) {
      alert("El título de la receta es obligatorio.");
      return;
    }

    // 🧂 Ingredientes
    const ingredienteItems = document.querySelectorAll("#contenedorIngredientes .ingrediente-item");
    const ingredientes = [];

    ingredienteItems.forEach((item) => {
      const nombreIng = item.querySelector("input[placeholder='Ingrediente']").value.trim();
      const cantidad = item.querySelector("input[placeholder='Cantidad']").value.trim();
      const unidad = item.querySelector("select").value;

      if (nombreIng) {
        ingredientes.push({
          nombre: nombreIng,
          cantidad: cantidad || "",
          unidad: unidad || ""
        });
      }
    });

    if (ingredientes.length === 0) {
      alert("Debes agregar al menos un ingrediente.");
      return;
    }

    // 👣 Pasos
    const pasoItems = document.querySelectorAll("#contenedorPasos .paso-item");
    const pasos = [];

    pasoItems.forEach((item) => {
      const textoPaso = item.querySelector("textarea").value.trim();
      if (textoPaso) {
        pasos.push({
          instruccion: textoPaso,
          imagenUrl: "", // por ahora vacío
          videoUrl: ""   // por ahora vacío
        });
      }
    });

    if (pasos.length === 0) {
      alert("Debes agregar al menos un paso.");
      return;
    }

    // 🧾 Objeto que el backend espera (campos del modelo actual)
    const payload = {
      titulo,
      descripcion,
      ingredientes,
      pasos,
      presupuestoPorPorcion,
      tiempoPreparacionMin,
      autorId
    };

    // 👇 Campos extra que HOY el modelo no tiene, pero los mandamos
    // por si luego amplían el schema (no rompe nada, Mongoose los ignora si no existen)
    payload.categoria = categoria;
    payload.ocasion = ocasion;
    payload.imagenUrl = imagenUrl;

    console.log("Enviando receta:", payload);

    try {
      const respuesta = await fetch("http://localhost:3000/recetas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const resultado = await respuesta.json().catch(() => ({}));

      if (!respuesta.ok) {
        console.error("Error al registrar receta:", resultado);
        alert(resultado.mensaje || resultado.mensajeError || "No se pudo registrar la receta.");
        return;
      }

      alert("Receta registrada correctamente. Queda pendiente de aprobación por el administrador.");
      form.reset();

      // Si quieres, aquí puedes redirigir
      // window.location.href = "/front-end/pagina-principal.html";

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión con el servidor.");
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
