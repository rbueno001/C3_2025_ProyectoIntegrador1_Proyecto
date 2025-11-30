const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Subdocumento para ingredientes
const ingredienteSchema = new mongoose.Schema({
    nombre: String,
    cantidad: String,      // Mongoose va a convertir el número que mandamos a string sin problemas
    unidad: String,
    costoEstimado: Number  // opcional, por si luego calculan costos
});

// Subdocumento para pasos
const pasoSchema = new mongoose.Schema({
    instruccion: String,
    imagenUrl: String,
    videoUrl: String
});

// Esquema principal de Receta
const recetaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },

    descripcion: String,

    // Tipo / categoría (Pollo, Carne, Postres, etc.)
    tipo: {
        type: String
    },

    // Ocasión (Desayuno, Almuerzo, Cena, Fiestas, etc.)
    ocasion: {
        type: String
    },

    // Número de porciones
    porciones: {
        type: Number
    },

    ingredientes: [ingredienteSchema],
    pasos: [pasoSchema],

    presupuestoPorPorcion: Number,
    tiempoPreparacionMin: Number,

    // Usuario que creó la receta
    autor: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },

    creadoEn: {
        type: Date,
        default: Date.now
    },

    // Estado para el flujo de aprobación por el admin
    estado: {
        type: String,
        enum: ["pendiente", "aprobada", "rechazada"],
        default: "pendiente"
    },

    // Usuarios que le han dado like
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    }]
});

const Receta = mongoose.model("Receta", recetaSchema);
module.exports = Receta;
