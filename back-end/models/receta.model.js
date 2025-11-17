// Modelo (esqueleto, estructura) de lo que se almacenará en la BD
// Usuario: correo (string), nombre (string), cédula (string), celular (number), contraseña (string)

const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

// Creación del esquema
const schemaReceta = new mongoose.Schema({
    nombreReceta: {
        type: String,
        required: true,
        unique: true
    },
    ingrediente: {
        type: String,
        required: true,
        unique: false
    },
    cantidad: {
        type: String,
        required: true,
        unique: true
    },
    medida: {
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
    }

});

const Usuario = mongoose.model("Usuario", schemaUsuario);
module.exports = Usuario; 