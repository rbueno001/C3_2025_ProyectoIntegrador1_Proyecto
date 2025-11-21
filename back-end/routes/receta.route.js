// Ruta: Gestión de Recetas
const express = require("express");
const router = express.Router();

// Modelos
const Receta = require("../models/receta.model");
const Usuario = require("../models/usuario.model");

// GET: Listar todas las recetas
router.get("/", async (req, res) => {
    try {
        const recetas = await Receta.find().populate("autor", "nombre email");
        res.json(recetas);
    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

// GET: Obtener receta por ID
router.get("/:id", async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id).populate("autor", "nombre email");
        if (!receta) return res.status(404).json({ mensaje: "Receta no encontrada" });
        res.json(receta);
    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

// DELETE: Eliminar receta por ID
router.delete("/:id", async (req, res) => {
    try {
        const receta = await Receta.findByIdAndDelete(req.params.id);
        if (!receta) return res.status(404).json({ mensaje: "Receta no encontrada" });

        await Usuario.findByIdAndUpdate(receta.autor, {
            $pull: { recetas: receta._id }
        });

        res.json({ mensaje: "Receta eliminada" });
    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

module.exports = router;