// Rutas para la gestión de recetas
const express = require("express");
const router = express.Router();
const Receta = require("../models/receta.model");
const Usuario = require("../models/usuario.model");
const multer = require("multer");
const path = require("path");
const { uploadPasos } = require("../middleware/multer");

// Storage para imagen principal
const storagePrincipal = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/recetas");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const nombre = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
        cb(null, nombre);
    }
});

// Validación de imagen principal
const uploadPrincipal = multer({
    storage: storagePrincipal,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb(new Error("La foto principal debe ser una imagen"), false);
        }
    }
});

// POST: Crear receta
router.post(
    "/",
    uploadPrincipal.single("imagenPrincipal"),
    uploadPasos.any(),
    async (req, res) => {
        try {
            const {
                titulo,
                autorNombre,
                categoria,
                complejidad,
                porciones,
                tiempoTotal,
                descripcion,
                ingredientes,
                pasos,
                usuarioId
            } = req.body;

            // Validaciones mínimas
            if (!titulo || !usuarioId) {
                return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
            }

            // Validar usuario que registra la receta
            const usuario = await Usuario.findById(usuarioId);
            if (!usuario) {
                return res.status(404).json({ mensaje: "El usuario no existe." });
            }

            // Convertir JSON
            const ingredientesArray = ingredientes ? JSON.parse(ingredientes) : [];
            const pasosArray = pasos ? JSON.parse(pasos) : [];

            // Asignar imágenes/videos a pasos
            if (req.files && req.files.length > 0) {
                req.files.forEach((file, index) => {
                    if (!pasosArray[index]) return;

                    if (file.mimetype.startsWith("image")) {
                        pasosArray[index].imagenUrl =
                            "/uploads/pasos/imagenes/" + file.filename;
                    } else if (file.mimetype.startsWith("video")) {
                        pasosArray[index].videoUrl =
                            "/uploads/pasos/videos/" + file.filename;
                    }
                });
            }

            // Foto principal obligatoria
            let fotoPrincipalUrl = "";
            if (req.file) {
                fotoPrincipalUrl = "/uploads/recetas/" + req.file.filename;
            } else {
                return res.status(400).json({
                    mensaje: "La foto principal es obligatoria."
                });
            }

            // Crear receta
            const nuevaReceta = new Receta({
                titulo,
                autorNombre: autorNombre || "",
                autor: usuario._id,
                categoria,
                complejidad,
                descripcion,
                tiempoPreparacionMin: tiempoTotal,
                presupuestoPorPorcion: porciones,
                ingredientes: ingredientesArray,
                pasos: pasosArray,
                imagenPrincipal: fotoPrincipalUrl,
                aprobada: false
            });

            await nuevaReceta.save();

            // Agregar receta al usuario
            usuario.recetas.push(nuevaReceta._id);
            await usuario.save();

            return res.status(201).json({
                mensaje:
                    "Su receta ha sido recibida y será publicada en cuanto sea aprobada por el administrador.",
                recetaId: nuevaReceta._id
            });
        } catch (error) {
            console.error("Error al registrar receta:", error);
            return res.status(500).json({
                mensaje: "Error al crear la receta.",
                error: error.message
            });
        }
    }
);

module.exports = router;