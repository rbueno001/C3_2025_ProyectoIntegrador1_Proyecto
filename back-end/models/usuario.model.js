const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaUsuario = new mongoose.Schema({
    correo: {
        type: String,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    cedula: {
        type: String,
        required: true,
        unique: true
    },
    celular: {
        type: Number,
        required: true
    },
    contrasenia: {
        type: String,
        required: true
    },
    nombreUsuario: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ["chef", "usuario", "admin"],
        default: "usuario",
        required: true
    },
    recetas: [{
        type: Schema.Types.ObjectId,
        ref: "Receta"
    }]
});

const Usuario = mongoose.model("Usuario", schemaUsuario);
module.exports = Usuario;
