

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reporteSchema = new Schema({
  // Quién hizo el reporte
  reportadoPor: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },

  // A quién están reportando
  usuarioReportado: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },

  // Motivo breve
  motivo: {
    type: String,
    required: true
  },

  // Detalle opcional
  descripcion: {
    type: String
  },

  // Opcional: si el reporte está ligado a una receta
  receta: {
    type: Schema.Types.ObjectId,
    ref: "Receta",
    required: false
  },

  fecha: {
    type: Date,
    default: Date.now
  },

  estado: {
    type: String,
    enum: ["pendiente", "abuso", "resuelto"],
    default: "pendiente"
  }
});

const Reporte = mongoose.model("Reporte", reporteSchema);
module.exports = Reporte;
