require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const usuarioRoute = require("./routes/usuario.route");
const recetaRoute = require("./routes/receta.route");
const adminRoutes = require("./routes/admin.routes");



const app = express();

// CORS
app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));

// JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Conexión a MongoDB Atlas exitosa"))
    .catch(err => console.error("Error al conectar a MongoDB Atlas:", err));

// Rutas
app.use("/usuarios", usuarioRoute);
app.use("/recetas", recetaRoute);
app.use("/admin", adminRoutes);


// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});