const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const recetaRoute = require("./routes/receta.route");
const usuarioRoute = require("./routes/usuario.route");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB conectado"))
.catch(err => console.error("Error de conexión:", err));

app.use("/recetas", recetaRoute);
app.use("/usuarios", usuarioRoute);

app.get("/", (req, res) => {
    res.send("Servidor activo");
});

app.listen(PORT, () => {
    console.log("Servidor corriendo en http://localhost:" + PORT);
});