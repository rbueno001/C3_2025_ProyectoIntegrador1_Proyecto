const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pasoSchema = new mongoose.Schema({
  instruccion: { type: String, required: true },
  mediaUrl: { type: String, default: "" }   // imagen o video opcional
});

const ingredienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
  unidad: { type: String, required: true }
});

const recetaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autorNombre: { type: String, default: "" },
  descripcion: { type: String, required: true },
  fotoPrincipal: { type: String, required: true },
  tiempoPreparacionMin: { type: Number, default: 0 },
  presupuestoPorPorcion: { type: Number, default: 0 },

  tipo: { type: String, required: true },
  ocasion: { type: String, default: "" },
  porciones: { type: Number, default: 0 },

  ingredientes: [ingredienteSchema],
  pasos: [pasoSchema],

  autorId: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },

  aprobado: { type: Boolean, default: false }
});

module.exports = mongoose.model("Receta", recetaSchema);