const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  searchEvents,
  attendEvent,
  getEventById
} = require("../controllers/events.controller");

const verifyToken = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/test", (req, res) => {
  res.send("Ruta de eventos funcionando!");
});

router.get("/all", getAllEvents);
router.get("/search", searchEvents);
router.get("/:id", getEventById); // Ruta nueva para detalle
router.post("/create", verifyToken, upload.single("poster"), createEvent);
router.post("/:id/attend", verifyToken, attendEvent);

module.exports = router;
