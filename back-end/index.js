const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const usuarioRoute = require("./routes/usuario.route");
const recetaRoute = require("./routes/receta.route");
const planificadorRoute = require("./routes/planificador.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect("mongodb://localhost:27017/gastroworks")
    .then(() => console.log("Conexión a MongoDB exitosa"))
    .catch(err => console.error("Error al conectar a MongoDB:", err));

app.use("/usuarios", usuarioRoute);
app.use("/recetas", recetaRoute);
app.use("/planificador", planificadorRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto " + PORT);
});