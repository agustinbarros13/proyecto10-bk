const express = require("express");
const router = express.Router();

const { register, login, getProfile } = require("../controllers/auth.controller");
const verifyToken = require("../middleware/auth.middleware");

// Ruta para registrar un nuevo usuario
router.post("/register", register);

// Ruta para iniciar sesión
router.post("/login", login);

// 🔐 Ruta protegida para obtener perfil del usuario autenticado
router.get("/profile", verifyToken, getProfile);

module.exports = router;
