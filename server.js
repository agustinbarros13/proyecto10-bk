// Carga las variables de entorno del archivo .env
require("dotenv").config();

// Dependencias
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Rutas
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/events.routes");

// Creamos la app de Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors()); // Permite que el frontend se conecte sin bloqueos CORS
app.use(express.json()); // Para que Express entienda JSON en las peticiones

// Conectamos con MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

// Rutas base del backend
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
