const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt");

// ======================================
//   REGISTRAR USUARIO
// ======================================
exports.registrarUsuario = async (req, res) => {
    try {
        const { nombre, correo, nombreUsuario, cedula, celular, contrasenia, intereses, nivelConocimiento } = req.body;

        // Validación básica
        if (!nombre || !correo || !nombreUsuario || !contrasenia) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
        }

        // ¿Correo ya existe?
        const correoExiste = await Usuario.findOne({ correo });
        if (correoExiste) {
            return res.status(400).json({ mensaje: "El correo ya está registrado." });
        }

        // ¿Usuario ya existe?
        const usuarioExiste = await Usuario.findOne({ nombreUsuario });
        if (usuarioExiste) {
            return res.status(400).json({ mensaje: "El nombre de usuario ya existe." });
        }

        // Encriptar contraseña
        const hash = await bcrypt.hash(contrasenia, 10);

        const nuevo = new Usuario({
            nombre,
            correo,
            nombreUsuario,
            cedula,
            celular,
            contrasenia: hash,
            intereses,
            nivelConocimiento,
            rol: "usuario"
        });

        await nuevo.save();

        res.status(201).json({
            mensaje: "Usuario registrado correctamente."
        });

    } catch (error) {
        console.error("Error registrando usuario:", error);
        res.status(500).json({ mensaje: "Error en servidor." });
    }
};

// ======================================
//   LOGIN
// ======================================
exports.loginUsuario = async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;

        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado." });
        }

        const coincide = await bcrypt.compare(contrasenia, usuario.contrasenia);
        if (!coincide) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta." });
        }

        res.json({
            mensaje: "Login exitoso.",
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error("Error login:", error);
        res.status(500).json({ mensaje: "Error en servidor." });
    }
};