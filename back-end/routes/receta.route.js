// Ruta: Gestión de Recetas
const express = require("express");
const router = express.Router();

// Modelos
const Receta = require("../models/receta.model");
const Usuario = require("../models/usuario.model");

/* ============================================================
   GET — Obtener SOLO recetas aprobadas (público)
   GET /recetas
============================================================ */
router.get("/", async (req, res) => {
    try {
        const recetas = await Receta.find({ estado: "aprobada" })
            .populate("autor", "nombre correo");

        res.json(recetas);
    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

/* ============================================================
   GET — Obtener receta por ID
   GET /recetas/:id
============================================================ */
router.get("/:id", async (req, res) => {
    try {
        const receta = await Receta.findById(req.params.id)
            .populate("autor", "nombre correo");

        if (!receta) {
            return res.status(404).json({ mensaje: "Receta no encontrada" });
        }

        res.json(receta);
    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

/* ============================================================
   POST — Crear receta (queda en pendiente)
   POST /recetas
============================================================ */
router.post("/", async (req, res) => {
    try {
        const {
            titulo,
            descripcion,
            ingredientes,
            pasos,
            presupuestoPorPorcion,
            tiempoPreparacionMin,
            autorId
        } = req.body;

        if (!titulo || !autorId) {
            return res.status(400).json({
                mensaje: "El título y el autor son obligatorios."
            });
        }

        const autor = await Usuario.findById(autorId);
        if (!autor) {
            return res.status(404).json({ mensaje: "Autor no encontrado." });
        }

        const nuevaReceta = new Receta({
            titulo,
            descripcion,
            ingredientes,
            pasos,
            presupuestoPorPorcion,
            tiempoPreparacionMin,
            autor: autorId, // Referencia al usuario
            estado: "pendiente"
        });

        const recetaGuardada = await nuevaReceta.save();

        // Agregar receta al usuario
        await Usuario.findByIdAndUpdate(autorId, {
            $push: { recetas: recetaGuardada._id }
        });

        res.status(201).json({
            mensaje: "Receta creada. Pendiente de aprobación.",
            receta: recetaGuardada
        });

    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

/* ============================================================
   DELETE — Eliminar receta por ID
   DELETE /recetas/:id
============================================================ */
router.delete("/:id", async (req, res) => {
    try {
        const receta = await Receta.findByIdAndDelete(req.params.id);
        if (!receta) {
            return res.status(404).json({ mensaje: "Receta no encontrada" });
        }

        // Quitar receta del usuario
        await Usuario.findByIdAndUpdate(receta.autor, {
            $pull: { recetas: receta._id }
        });

        res.json({ mensaje: "Receta eliminada correctamente" });

    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

/* ============================================================
   GET — Obtener todas las recetas pendientes (para ADMIN)
   GET /recetas-admin/pendientes
============================================================ */
router.get("/admin/pendientes", async (req, res) => {
    try {
        const recetas = await Receta.find({ estado: "pendiente" })
            .populate("autor", "nombre correo");

        res.json(recetas);
    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

/* ============================================================
   PUT — Aprobar receta
   PUT /recetas-admin/:id/aprobar
============================================================ */
router.put("/admin/:id/aprobar", async (req, res) => {
    try {
        const receta = await Receta.findByIdAndUpdate(
            req.params.id,
            { estado: "aprobada" },
            { new: true }
        );

        if (!receta) {
            return res.status(404).json({ mensaje: "Receta no encontrada" });
        }

        res.json({ mensaje: "Receta aprobada", receta });

    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

/* ============================================================
   PUT — Rechazar receta
   PUT /recetas-admin/:id/rechazar
============================================================ */
router.put("/admin/:id/rechazar", async (req, res) => {
    try {
        const receta = await Receta.findByIdAndUpdate(
            req.params.id,
            { estado: "rechazada" },
            { new: true }
        );

        if (!receta) {
            return res.status(404).json({ mensaje: "Receta no encontrada" });
        }

        res.json({ mensaje: "Receta rechazada", receta });

    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

module.exports = router;
