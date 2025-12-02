const express = require("express");
const router = express.Router();
const Receta = require("../models/receta.model");
const upload = require("../middleware/multer");
const path = require("path");

// Subida de archivos:
// fotoPrincipal: 1 archivo
// pasoMedia: múltiples (imagen o video)
router.post(
  "/",
  upload.fields([
    { name: "fotoPrincipal", maxCount: 1 },
    { name: "pasoMedia", maxCount: 20 }
  ]),
  async (req, res) => {
    try {
      // Foto principal obligatoria
      if (!req.files || !req.files.fotoPrincipal) {
        return res.status(400).json({ mensaje: "La foto principal es obligatoria." });
      }

      const fotoPrincipalFile = req.files.fotoPrincipal[0];

      const {
        titulo,
        descripcion,
        autorNombre,
        tipo,
        ocasion,
        tiempoPreparacionMin,
        presupuestoPorPorcion,
        porciones,
        autorId
      } = req.body;

      // Validación básica
      if (!titulo || !descripcion || !tipo || !autorId) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios." });
      }

      // Ingredientes
      let ingredientes = [];
      if (req.body.ingredientes) {
        ingredientes = JSON.parse(req.body.ingredientes);
      }

      // Pasos
      let pasos = [];
      if (req.body.pasos) {
        const pasosFront = JSON.parse(req.body.pasos);
        const media = req.files.pasoMedia || [];

        pasos = pasosFront.map((p, i) => {
          let mediaUrl = "";

          if (p.mediaIndex !== null && media[p.mediaIndex]) {
            mediaUrl = "/uploads/recetas/" + media[p.mediaIndex].filename;
          }

          return {
            instruccion: p.instruccion,
            mediaUrl
          };
        });
      }

      const nuevaReceta = new Receta({
        titulo,
        autorNombre,
        descripcion,
        tipo,
        ocasion,
        tiempoPreparacionMin,
        presupuestoPorPorcion,
        porciones,
        autorId,
        fotoPrincipal: "/uploads/recetas/" + fotoPrincipalFile.filename,
        ingredientes,
        pasos
      });

      await nuevaReceta.save();

      res.status(201).json({ mensaje: "Receta registrada correctamente.", receta: nuevaReceta });

    } catch (error) {
      console.error("Error guardando receta:", error);
      res.status(500).json({ mensaje: "Error en el servidor.", error: error.message });
    }
  }
);
/* ============================================================
   ADMIN – OBTENER RECETAS PENDIENTES
   GET /recetas/admin/pendientes
============================================================ */
router.get("/admin/pendientes", async (req, res) => {
    try {
        const recetas = await Receta.find({ estado: "pendiente" })
            .populate("autorId", "nombre correo nombreUsuario");

        res.status(200).json(recetas);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener recetas pendientes",
            error: error.message
        });
    }
});

/* ============================================================
   ADMIN – APROBAR RECETA
   PUT /recetas/admin/:id/aprobar
============================================================ */
router.put("/admin/:id/aprobar", async (req, res) => {
    try {
        const receta = await Receta.findByIdAndUpdate(
            req.params.id,
            { estado: "aprobada" },
            { new: true }
        );

        if (!receta) {
            return res.status(404).json({ mensaje: "Receta no encontrada." });
        }

        res.status(200).json({
            mensaje: "Receta aprobada correctamente.",
            receta
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al aprobar receta",
            error: error.message
        });
    }
});

/* ============================================================
   ADMIN – RECHAZAR RECETA
   PUT /recetas/admin/:id/rechazar
============================================================ */
router.put("/admin/:id/rechazar", async (req, res) => {
    try {
        const receta = await Receta.findByIdAndUpdate(
            req.params.id,
            { estado: "rechazada" },
            { new: true }
        );

        if (!receta) {
            return res.status(404).json({ mensaje: "Receta no encontrada." });
        }

        res.status(200).json({
            mensaje: "Receta rechazada correctamente.",
            receta
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al rechazar receta",
            error: error.message
        });
    }
});

module.exports = router;