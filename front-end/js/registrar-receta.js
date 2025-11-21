// Captura del formulario
const form = document.getElementById("formReceta");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombreReceta").value;
    const categoria = document.getElementById("categoria").value;

    // Ingredientes
    const ingredienteItems = document.querySelectorAll("#contenedorIngredientes .ingrediente-item");
    let ingredientes = [];

    ingredienteItems.forEach(item => {
        const nombreIng = item.querySelector("input[placeholder='Ingrediente']").value;
        const cantidad = item.querySelector("input[placeholder='Cantidad']").value;
        const unidad = item.querySelector("select").value;

        ingredientes.push({ nombre: nombreIng, cantidad, unidad });
    });

    // Pasos
    const pasoItems = document.querySelectorAll("#contenedorPasos .paso-item");
    let pasos = [];
    let videos = [];

    pasoItems.forEach((item, index) => {
        const descripcion = item.querySelector("textarea").value;
        const file = item.querySelector("input[type='file']").files[0] || null;

        pasos.push({ descripcion });

        if (file) {
            videos.push(file);
        }
    });

    // Obtener ID del autor desde sesión
    const usuarioLogeado = JSON.parse(localStorage.getItem("usuario"));
    const autor = usuarioLogeado?.id;

    if (!autor) {
        alert("Debe iniciar sesión para registrar una receta.");
        return;
    }

    // FormData para enviar todo al backend
    const formData = new FormData();

    formData.append("titulo", nombre);
    formData.append("categoria", categoria);
    formData.append("autor", autor);
    formData.append("ingredientes", JSON.stringify(ingredientes));
    formData.append("pasos", JSON.stringify(pasos));

    videos.forEach(video => {
        formData.append("videosPasos", video);
    });

    try {
        const respuesta = await fetch("http://localhost:3000/recetas", {
            method: "POST",
            body: formData
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert("Receta registrada correctamente.");
            form.reset();
        } else {
            alert("Error al registrar receta: " + resultado.mensajeError);
        }

    } catch (error) {
        alert("Error de conexión: " + error.message);
    }
});

// INGREDIENTES DINÁMICOS
document.getElementById("btnAgregarIngrediente").addEventListener("click", () => {
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

// PASOS DINÁMICOS
document.getElementById("btnAgregarPaso").addEventListener("click", () => {
    const cont = document.getElementById("contenedorPasos");

    cont.insertAdjacentHTML("beforeend", `
        <div class="mb-3 paso-item">
            <textarea class="form-control input-custom" placeholder="Describa el paso" required></textarea>
            <input type="file" accept="video/*" class="form-control mt-2">
        </div>
    `);
});