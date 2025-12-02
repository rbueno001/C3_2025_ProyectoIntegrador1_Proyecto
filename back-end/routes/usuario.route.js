const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario.model");
const bcrypt = require("bcryptjs");

/* ============================================================
   REGISTRAR USUARIO
   POST /usuarios
============================================================ */
router.post("/", async (req, res) => {
    try {
        const {
            nombre,
            correo,
            nombreUsuario,
            cedula,
            celular,
            contrasenia,
            rol,
            intereses,
            nivel
        } = req.body;

        // Validación básica
        if (!nombre || !correo || !nombreUsuario || !cedula || !celular || !contrasenia) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
        }

        // Validación de duplicados
        const existeCorreo = await Usuario.findOne({ correo });
        if (existeCorreo) return res.status(400).json({ mensaje: "El correo ya está registrado." });

        const existeCedula = await Usuario.findOne({ cedula });
        if (existeCedula) return res.status(400).json({ mensaje: "La cédula ya está registrada." });

        const existeUsuario = await Usuario.findOne({ nombreUsuario });
        if (existeUsuario) {
            return res.status(400).json({ mensaje: "El nombre de usuario ya existe." });
        }

        // Encriptar contraseña
        const contraseniaEncriptada = await bcrypt.hash(contrasenia, 10);

        const nuevoUsuario = new Usuario({
            nombre,
            correo,
            nombreUsuario,
            cedula,
            celular,
            contrasenia: contraseniaEncriptada,
            rol: rol || "usuario",  // usuario por defecto
            intereses: intereses || [],
            nivel: nivel || "Principiante",
            recetas: []
        });

        await nuevoUsuario.save();

        res.status(201).json({
            mensaje: "Usuario registrado correctamente.",
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo,
                nombreUsuario: nuevoUsuario.nombreUsuario,
                cedula: nuevoUsuario.cedula,
                celular: nuevoUsuario.celular,
                rol: nuevoUsuario.rol,
                intereses: nuevoUsuario.intereses,
                nivel: nuevoUsuario.nivel
            }
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al registrar usuario",
            error: error.message
        });
    }
});

/* ============================================================
   VALIDAR CREDENCIALES
   POST /usuarios/validar-credenciales
============================================================ */
router.post("/validar-credenciales", async (req, res) => {
    const { nombreUsuarioOCorreo, contrasenia } = req.body;

    if (!nombreUsuarioOCorreo || !contrasenia) {
        return res.status(400).json({
            mensaje: "Los campos 'nombreUsuarioOCorreo' y 'contrasenia' son obligatorios."
        });
    }

    try {
        const usuario = await Usuario.findOne({
            $or: [
                { nombreUsuario: nombreUsuarioOCorreo },
                { correo: nombreUsuarioOCorreo }
            ]
        }).populate("recetas");

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado."
            });
        }

        const esContraseniaValida = await bcrypt.compare(
            contrasenia,
            usuario.contrasenia
        );

        if (!esContraseniaValida) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta." });
        }

        const usuarioResponse = {
            id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            cedula: usuario.cedula,
            celular: usuario.celular,
            nombreUsuario: usuario.nombreUsuario,
            rol: usuario.rol,
            intereses: usuario.intereses,
            nivel: usuario.nivel,
            recetas: usuario.recetas
        };

        res.status(200).json({
            success: true,
            mensaje: "Inicio de sesión exitoso.",
            usuario: usuarioResponse
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al validar credenciales.",
            error: error.message
        });
    }
});

/* ============================================================
   OBTENER USUARIO POR ID
   GET /usuarios/:id
============================================================ */
router.get("/:id", async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).populate("recetas");

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado." });
        }

        res.status(200).json(usuario);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuario." });
    }
});

module.exports = router;