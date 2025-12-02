const express = require("express");
const router = express.Router();
const Receta = require("../models/receta.model");  // ← CORREGIDO
const Usuario = require("../models/usuario.model");

// ===========================================
//   Obtener recetas de un usuario
// ===========================================
router.get("/:usuarioId", async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;

        const recetas = await Receta.find({ autorId: usuarioId });

        res.status(200).json(recetas);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las recetas del usuario",
            error: error.message
        });
    }
});

// ===========================================
//   Generar lista de compras (ingredientes únicos)
// ===========================================
router.post("/lista-compras", async (req, res) => {
    try {
        const { recetasSeleccionadas } = req.body;

        if (!recetasSeleccionadas || recetasSeleccionadas.length === 0) {
            return res.status(400).json({
                mensaje: "Debe seleccionar al menos una receta."
            });
        }

        const recetas = await Receta.find({
            _id: { $in: recetasSeleccionadas }
        });

        let lista = [];

        recetas.forEach(receta => {
            receta.ingredientes.forEach(ing => {
                lista.push({
                    nombre: ing.nombre,
                    cantidad: ing.cantidad,
                    unidad: ing.unidad
                });
            });
        });

        res.status(200).json(lista);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al generar la lista de compras",
            error: error.message
        });
    }
});

module.exports = router;