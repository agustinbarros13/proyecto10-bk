const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  searchEvents,
  attendEvent,
  removeAttendance, // 👈 NUEVO
  getEventById,
} = require("../controllers/events.controller");

const verifyToken = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// GET /api/events/all -> Listar todos los eventos
router.get("/all", getAllEvents);

// GET /api/events/search?q= -> Buscar eventos
router.get("/search", searchEvents);

// GET /api/events/:id -> Obtener detalle de un evento
router.get("/:id", getEventById);

// POST /api/events/create -> Crear un evento (requiere auth y permite subir cartel)
router.post("/create", verifyToken, upload.single("poster"), createEvent);

// POST /api/events/:id/attend -> Confirmar asistencia (requiere auth)
router.post("/:id/attend", verifyToken, attendEvent);

// DELETE /api/events/:id/attend -> Quitar asistencia (requiere auth)
router.delete("/:id/attend", verifyToken, removeAttendance); // 👈 NUEVO

module.exports = router;
