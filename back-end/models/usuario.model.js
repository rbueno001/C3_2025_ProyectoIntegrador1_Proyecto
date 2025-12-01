const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    nombreUsuario: {
        type: String,
        required: true,
        unique: true
    },
    cedula: {
        type: String,
        required: true,
        unique: true
    },
    celular: {
        type: String,
        required: true
    },
    contrasenia: {
        type: String,
        required: true
    },
    intereses: {
        type: [String],
        default: []
    },
    nivelConocimiento: {
        type: String,
        required: true
    },
    recetas: [
        {
            type: Schema.Types.ObjectId,
            ref: "Receta"
        }
    ]
});

module.exports = mongoose.model("Usuario", usuarioSchema);