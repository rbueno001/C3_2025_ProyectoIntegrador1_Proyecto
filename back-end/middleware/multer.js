// Middleware para subir imágenes y videos de recetas

const multer = require("multer");
const path = require("path");

// Carpeta de archivos
const destino = path.join(__dirname, "..", "uploads", "recetas");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, destino),

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "_" + file.fieldname + ext;
    cb(null, name);
  }
});

// Solo imágenes o videos
function filtro(req, file, cb) {
  const tipos = ["image/", "video/"];
  if (tipos.some(t => file.mimetype.startsWith(t))) cb(null, true);
  else cb(new Error("Tipo de archivo no permitido."), false);
}

const upload = multer({
  storage,
  fileFilter: filtro
});

module.exports = upload;