// api.js - Cliente del backend para Gastro Works

const API_BASE = "http://localhost:3000";

async function apiFetch(url, options = {}) {
    const respuesta = await fetch(API_BASE + url, options);
    if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => ({ mensaje: "Error desconocido" }));
        throw new Error(error.mensaje || error.mensajeError || "Error en la solicitud");
    }
    return respuesta.json();
}

// ============================
// USUARIOS
// ============================
async function loginUsuario(correo, contrasenia) {
    return apiFetch("/usuarios/login-encriptado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasenia })
    });
}

async function registrarUsuario(data) {
    return apiFetch("/usuarios/contrasenia-segura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
}

// ============================
// RECETAS
// ============================
async function registrarReceta(formData) {
    return apiFetch("/recetas", {
        method: "POST",
        body: formData
    });
}

async function obtenerRecetas() {
    return apiFetch("/recetas", {
        method: "GET"
    });
}

// ============================
// PLANIFICADOR / LISTA DE COMPRAS
// ============================
async function generarListaCompras(idsRecetas) {
    return apiFetch("/planificador/lista-compra", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recetas: idsRecetas })
    });
}

// ============================
// EXPORTAR
// ============================
window.GW_API = {
    loginUsuario,
    registrarUsuario,
    registrarReceta,
    obtenerRecetas,
    generarListaCompras
};