const express = require("express");
const router = express.Router();
const Receta = require("../models/receta.model");
const Usuario = require("../models/usuario.model");
const { uploadPasos } = require("../middleware/multer");

router.post(
    "/",
    uploadPasos.fields([
        { name: "imagenesPasos", maxCount: 30 },
        { name: "videosPasos", maxCount: 30 }
    ]),
    async (req, res) => {

        const {
            titulo,
            descripcion,
            presupuestoPorPorcion,
            tiempoPreparacionMin,
            autor
        } = req.body;

        let ingredientes = [];
        let pasos = [];

        try {
            ingredientes = JSON.parse(req.body.ingredientes);
            pasos = JSON.parse(req.body.pasos);
        } catch (err) {
            return res.status(400).json({ mensaje: "El formato de ingredientes o pasos no es válido" });
        }

        if (!titulo || !ingredientes.length || !pasos.length || !autor) {
            return res.status(400).json({ mensaje: "Título, ingredientes, pasos y autor son obligatorios" });
        }

        const imagenes = req.files["imagenesPasos"] || [];
        const videos = req.files["videosPasos"] || [];

        imagenes.forEach((archivo, index) => {
            if (pasos[index]) {
                pasos[index].imagenUrl = "/uploads/pasos/imagenes/" + archivo.filename;
            }
        });

        videos.forEach((archivo, index) => {
            if (pasos[index]) {
                pasos[index].videoUrl = "/uploads/pasos/videos/" + archivo.filename;
            }
        });

        try {
            const nuevaReceta = new Receta({
                titulo,
                descripcion,
                ingredientes,
                pasos,
                presupuestoPorPorcion,
                tiempoPreparacionMin,
                autor
            });

            await nuevaReceta.save();

            await Usuario.findByIdAndUpdate(
                autor,
                { $push: { recetas: nuevaReceta._id } }
            );

            res.status(201).json(nuevaReceta);

        } catch (error) {
            res.status(500).json({ mensajeError: error.message });
        }
    }
);

module.exports = router;