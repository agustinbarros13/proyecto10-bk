// server.js
require("dotenv").config();

// Dependencias
const express = require("express");
const cors = require("cors");

// Conexión DB
const connectDB = require("./config/db");

// Rutas
const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/events.routes");
const userRoutes = require("./routes/user.routes"); // 🔹 NUEVO

// Inicializamos Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes); 

// 🔹 Rutas no declaradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    message: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

// 🔹 Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err);
  res.status(500).json({
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

// Exportamos app (útil para testing)
module.exports = app;
