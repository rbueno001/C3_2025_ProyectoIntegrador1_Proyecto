// Campos
const inputIngrediente = document.getElementById("inputIngrediente");

// Botones
const btnAgregarIncluir = document.getElementById("btnAgregarIncluir");
const btnAgregarExcluir = document.getElementById("btnAgregarExcluir");

// Listas
const listaIncluir = document.getElementById("listaIncluir");
const listaExcluir = document.getElementById("listaExcluir");

// Función para crear el item visual
function crearItem(texto, contenedor) {
    const item = document.createElement("div");
    item.className = "ingrediente-item";

    item.innerHTML = `
        <span>${texto}</span>
        <button class="boton-eliminar">Eliminar</button>
    `;

    item.querySelector(".boton-eliminar").onclick = () => item.remove();

    contenedor.appendChild(item);
}

// AGREGAR INGREDIENTE A INCLUIR
btnAgregarIncluir.addEventListener("click", () => {
    const texto = inputIngrediente.value.trim();
    if (texto === "") return;

    crearItem(texto, listaIncluir);
    inputIngrediente.value = "";
});

// AGREGAR INGREDIENTE A EXCLUIR
btnAgregarExcluir.addEventListener("click", () => {
    const texto = inputIngrediente.value.trim();
    if (texto === "") return;

    crearItem(texto, listaExcluir);
    inputIngrediente.value = "";
});