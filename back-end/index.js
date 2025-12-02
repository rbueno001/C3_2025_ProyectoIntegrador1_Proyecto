// ===============================
//  IMPORTS
// ===============================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ===============================
//  APP
// ===============================
const app = express();
app.use(cors());
app.use(express.json());

// ===============================
//  RUTAS
// ===============================
const recetaRoute = require("./routes/receta.route");
const usuarioRoute = require("./routes/usuario.route");
const adminRoute = require("./routes/admin.route");
const planificadorRoute = require("./routes/planificador.route");

app.use("/recetas", recetaRoute);
app.use("/usuarios", usuarioRoute);
app.use("/admin", adminRoute);
app.use("/planificador", planificadorRoute);

// ===============================
//  CONEXIÓN A MONGO ATLAS
// ===============================
mongoose.connect(
  "mongodb+srv://raquelbueno01:Cenfotec2025@clusterraquel.qjadhtd.mongodb.net/gastroworks?retryWrites=true&w=majority"
)
.then(() => {
  console.log("✔ Conexión a MongoDB Atlas exitosa");
})
.catch((error) => {
  console.log("❌ Error al conectar a MongoDB Atlas:", error);
});

// ===============================
//  SERVIDOR
// ===============================
const PORT = 3000;
app.listen(PORT, () => {
  console.log("Servidor en puerto " + PORT);
});