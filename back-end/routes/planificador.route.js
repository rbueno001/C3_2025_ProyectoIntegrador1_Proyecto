// Ruta: Planificador Semanal
const express = require("express");
const router = express.Router();

// Modelo
const Planificador = require("../models/planificador.model");

// POST: Crear plan semanal
router.post("/", async (req, res) => {
    try {
        const { usuarioId, semana, recetas } = req.body;

        const nuevoPlan = new Planificador({
            usuarioId,
            semana,
            recetas
        });

        await nuevoPlan.save();
        res.status(201).json(nuevoPlan);
    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

// GET: Obtener planificador de un usuario
router.get("/:usuarioId", async (req, res) => {
    try {
        const plan = await Planificador.find({
            usuarioId: req.params.usuarioId
        }).populate("recetas");

        res.json(plan);
    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

// PUT: Actualizar planificador por ID
router.put("/:id", async (req, res) => {
    try {
        const planActualizado = await Planificador.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(planActualizado);
    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

// DELETE: Eliminar planificador por ID
router.delete("/:id", async (req, res) => {
    try {
        await Planificador.findByIdAndDelete(req.params.id);
        res.json({ mensaje: "Planificador eliminado" });
    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

module.exports = router;