const multer = require("multer");
const path = require("path");

/* ================================
   Storage para imagen principal
================================ */
const storagePrincipal = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/recetas");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
    }
});

const uploadPrincipal = multer({
    storage: storagePrincipal,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image")) cb(null, true);
        else cb(null, false);
    }
});

/* ================================
   Storage para imágenes y videos de pasos
================================ */
const storagePasos = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith("video")) {
            cb(null, "uploads/pasos/videos");
        } else {
            cb(null, "uploads/pasos/imagenes");
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + ext);
    }
});

const uploadPasos = multer({
    storage: storagePasos,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

module.exports = {
    uploadPrincipal,
    uploadPasos
};