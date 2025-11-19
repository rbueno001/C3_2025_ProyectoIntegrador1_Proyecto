const multer = require("multer");
const path = require("path");

const storagePasos = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, "uploads/pasos/imagenes");
        } else if (file.mimetype.startsWith("video")) {
            cb(null, "uploads/pasos/videos");
        } else {
            cb(new Error("Tipo de archivo no soportado"), null);
        }
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const nombre = Date.now() + "-" + Math.round(Math.random() * 1e9) + extension;
        cb(null, nombre);
    }
});

function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imágenes y videos"), false);
    }
}

const uploadPasos = multer({
    storage: storagePasos,
    fileFilter: fileFilter,
    limits: { fileSize: 150 * 1024 * 1024 }
});

module.exports = { uploadPasos };