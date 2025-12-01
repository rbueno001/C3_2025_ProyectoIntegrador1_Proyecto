// routes/usuario.route.js
const express = require("express");
const router = express.Router();
const { crearUsuario } = require("../controllers/usuario.controller");

// RUTA CORRECTA PARA REGISTRAR
router.post("/usuarios/registrar", crearUsuario);

module.exports = router;