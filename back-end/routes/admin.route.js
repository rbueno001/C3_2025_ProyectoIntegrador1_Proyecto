
const express = require("express");
const router = express.Router();

const Usuario = require("../models/usuario.model");
const Receta = require("../models/receta.model");
const Reporte = require("../models/reporte.model");


/* ============================================================
   MÉTRICAS BÁSICAS
   GET /admin/usuarios
   GET /admin/recetas
   GET /admin/reportes
============================================================ */

// Total de usuarios registrados
router.get("/usuarios", async (req, res) => {
  try {
    const total = await Usuario.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error: error.message });
  }
});

// Total de recetas (por ahora todas, o solo aprobadas si quieren)
router.get("/recetas", async (req, res) => {
  try {
    const total = await Receta.countDocuments(); // o { estado: "aprobada" }
    res.json({ total });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener recetas", error: error.message });
  }
});

// Total y lista de reportes
router.get("/reportes", async (req, res) => {
  try {
    const reportes = await Reporte.find()
      .populate("reportadoPor", "nombre correo")
      .populate("usuarioReportado", "nombre correo")
      .populate("receta", "titulo");

    res.json({
      total: reportes.length,
      reportes
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reportes", error: error.message });
  }
});


/* ============================================================
   DETALLE DE REPORTE
   GET /admin/reportes/:id
============================================================ */

router.get("/reportes/:id", async (req, res) => {
  try {
    const reporte = await Reporte.findById(req.params.id)
      .populate("reportadoPor", "nombre correo")
      .populate("usuarioReportado", "nombre correo")
      .populate("receta", "titulo descripcion");

    if (!reporte) {
      return res.status(404).json({ mensaje: "Reporte no encontrado" });
    }

    res.json(reporte);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el reporte", error: error.message });
  }
});


/* ============================================================
   MARCAR REPORTE COMO ABUSO
   POST /admin/reportes/abuso/:id
============================================================ */

router.post("/reportes/abuso/:id", async (req, res) => {
  try {
    const reporte = await Reporte.findByIdAndUpdate(
      req.params.id,
      { estado: "abuso" },
      { new: true }
    );

    if (!reporte) {
      return res.status(404).json({ mensaje: "Reporte no encontrado" });
    }

    res.json({ mensaje: "Reporte marcado como abuso", reporte });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar reporte", error: error.message });
  }
});


/* ============================================================
   ELIMINAR REPORTE
   DELETE /admin/reportes/:id
============================================================ */

router.delete("/reportes/:id", async (req, res) => {
  try {
    const borrado = await Reporte.findByIdAndDelete(req.params.id);

    if (!borrado) {
      return res.status(404).json({ mensaje: "Reporte no encontrado" });
    }

    res.json({ mensaje: "Reporte eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar reporte", error: error.message });
  }
});


/* ============================================================
   RECETAS PENDIENTES DE APROBACIÓN
   GET /admin/recetas-pendientes
============================================================ */

router.get("/recetas-pendientes", async (req, res) => {
  try {
    const recetas = await Receta.find({ estado: "pendiente" })
      .populate("autor", "nombre correo");

    res.json({ recetas });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener recetas pendientes", error: error.message });
  }
});


/* ============================================================
   APROBAR RECETA
   POST /admin/recetas/:id/aprobar
============================================================ */

router.post("/recetas/:id/aprobar", async (req, res) => {
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
    res.status(500).json({ mensaje: "Error al aprobar receta", error: error.message });
  }
});


/* ============================================================
   RECHAZAR RECETA
   POST /admin/recetas/:id/rechazar
============================================================ */

router.post("/recetas/:id/rechazar", async (req, res) => {
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
    res.status(500).json({ mensaje: "Error al rechazar receta", error: error.message });
  }
});


/* ============================================================
   ADVERTENCIA Y SUSPENSIÓN (opcionales)
   POST /admin/advertencia/:idUsuario
   POST /admin/suspender/:idUsuario
============================================================ */

// Advertencia
router.post("/advertencia/:idUsuario", async (req, res) => {
  try {
    const sancion = new Sancion({
      usuario: req.params.idUsuario,
      tipo: "advertencia",
      motivo: req.body.motivo || "Advertencia desde panel admin"
    });

    await sancion.save();
    res.json({ mensaje: "Advertencia aplicada", sancion });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al aplicar advertencia", error: error.message });
  }
});

// Suspensión
router.post("/suspender/:idUsuario", async (req, res) => {
  try {
    const sancion = new Sancion({
      usuario: req.params.idUsuario,
      tipo: "suspension",
      motivo: req.body.motivo || "Suspensión desde panel admin"
    });

    await sancion.save();
    res.json({ mensaje: "Usuario suspendido", sancion });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al suspender usuario", error: error.message });
  }
});

module.exports = router;
