const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("agregar-ingrediente").addEventListener("click", agregarIngrediente);
    document.getElementById("agregar-paso").addEventListener("click", agregarPaso);
    document.getElementById("form-receta").addEventListener("submit", enviarReceta);
});

/* Ingredientes */
function agregarIngrediente() {
    const cont = document.getElementById("ingredientes-lista");

    const fila = document.createElement("div");
    fila.classList.add("row", "mt-3", "ingrediente-item");

    fila.innerHTML = `
        <div class="col-md-4">
            <input class="form-control" placeholder="Ingrese el ingrediente" name="ingrediente[]">
        </div>
        <div class="col-md-4">
            <input class="form-control" placeholder="Ingrese la cantidad" name="cantidad[]">
        </div>
        <div class="col-md-4">
            <select class="form-select" name="unidad[]">
                <option disabled selected>Seleccione la medida</option>
                <option>g</option>
                <option>kg</option>
                <option>ml</option>
                <option>l</option>
                <option>taza</option>
                <option>cucharada</option>
                <option>unidad</option>
            </select>
        </div>
    `;

    cont.appendChild(fila);
}

/* Pasos */
function agregarPaso() {
    const cont = document.getElementById("pasos-lista");
    const total = cont.querySelectorAll(".paso-item").length + 1;

    const paso = document.createElement("div");
    paso.classList.add("mt-3", "paso-item");

    paso.innerHTML = `
        <label class="form-label paso-titulo">Paso ${total}</label>
        <textarea class="form-control mb-2" name="paso_descripcion[]" placeholder="Describa el paso"></textarea>
        <label class="form-label">Foto o video del paso (opcional):</label>
        <input type="file" class="form-control mb-3" name="paso_media_${total}">
    `;

    cont.appendChild(paso);
}

/* Enviar */
async function enviarReceta(e) {
    e.preventDefault();

    const mensaje = document.getElementById("mensaje-confirmacion");
    mensaje.style.display = "none";

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || !usuario._id) {
        alert("Debe iniciar sesión para publicar recetas.");
        return;
    }

    const formData = new FormData();
    formData.append("titulo", document.querySelector("input[name='nombre_receta']").value);
    formData.append("autorNombre", document.querySelector("input[name='autor']").value);
    formData.append("categoria", document.querySelector("select[name='categoria']").value);
    formData.append("complejidad", document.querySelector("select[name='complejidad']").value);
    formData.append("porciones", document.querySelector("input[name='porciones']").value);
    formData.append("tiempoTotal", document.querySelector("input[name='tiempo']").value);
    formData.append("descripcion", document.querySelector("textarea[name='descripcion']").value);

    const imagenPrincipal = document.querySelector("input[name='foto_principal']").files[0];
    if (imagenPrincipal) formData.append("imagenPrincipal", imagenPrincipal);

    /* Ingredientes */
    const ingredientes = [];
    document.querySelectorAll(".ingrediente-item").forEach(item => {
        ingredientes.push({
            nombre: item.querySelector("input[name='ingrediente[]']").value,
            cantidad: item.querySelector("input[name='cantidad[]']").value,
            unidad: item.querySelector("select[name='unidad[]']").value
        });
    });
    formData.append("ingredientes", JSON.stringify(ingredientes));

    /* Pasos */
    const pasos = [];
    document.querySelectorAll(".paso-item").forEach((item, index) => {
        pasos.push({
            instruccion: item.querySelector("textarea").value
        });

        const archivo = item.querySelector("input[type='file']").files[0];
        if (archivo) formData.append(`pasoArchivo_${index}`, archivo);
    });
    formData.append("pasos", JSON.stringify(pasos));

    /* Usuario que registra */
    formData.append("usuarioId", usuario._id);

    try {
        const res = await fetch(`${API_URL}/recetas`, {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.mensaje || "No se pudo guardar la receta");
            return;
        }

        mensaje.textContent =
            "Su receta ha sido recibida y será publicada una vez que esté aprobada por el administrador.";
        mensaje.style.display = "block";

        document.getElementById("form-receta").reset();

    } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor.");
    }
}