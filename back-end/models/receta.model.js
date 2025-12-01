const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* Ingredientes */
const ingredienteSchema = new mongoose.Schema({
    nombre: String,
    cantidad: String,
    unidad: String,
    costoEstimado: Number
});

/* Pasos */
const pasoSchema = new mongoose.Schema({
    instruccion: String,
    imagenUrl: String,
    videoUrl: String
});

/* Receta */
const recetaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: String,
    categoria: String,
    complejidad: {
        type: String,
        enum: ["Fácil", "Media", "Difícil"],
        default: "Fácil"
    },
    porciones: Number,
    tiempoPreparacionMin: Number,
    presupuestoPorPorcion: Number,
    imagenPrincipal: String,
    ingredientes: [ingredienteSchema],
    pasos: [pasoSchema],

    autorNombre: String,  // autor libre (ej: Martha Stewart)
    autor: { type: Schema.Types.ObjectId, ref: "Usuario", required: true }, // usuario que publica

    aprobada: { type: Boolean, default: false }, // se vuelve pública cuando es aprobada
    creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Receta", recetaSchema);