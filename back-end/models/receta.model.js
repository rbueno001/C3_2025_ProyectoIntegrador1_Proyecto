const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredienteSchema = new mongoose.Schema({
    nombre: String,
    cantidad: String,
    unidad: String,
    costoEstimado: Number
});

const pasoSchema = new mongoose.Schema({
    instruccion: String,
    imagenUrl: String,
    videoUrl: String
});

const recetaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: String,
    ingredientes: [ingredienteSchema],
    pasos: [pasoSchema],
    presupuestoPorPorcion: Number,
    tiempoPreparacionMin: Number,
    autor: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
    creadoEn: { type: Date, default: Date.now }
});

const Receta = mongoose.model("Receta", recetaSchema);
module.exports = Receta;