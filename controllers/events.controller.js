const Event = require("../models/Event");

// ✅ Crear evento
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const poster = req.file?.path || "";

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      poster,
      createdBy: req.user.id,
    });

    await newEvent.save();

    res.status(201).json({
      message: "Evento creado correctamente",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creando evento:", error);
    res.status(500).json({ message: "Error al crear evento", error });
  }
};

// ✅ Listar todos los eventos (ordenados por fecha)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: -1 })
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

    res.status(200).json(events);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ message: "Error al obtener eventos", error });
  }
};

// ✅ Buscar eventos por texto (título, descripción o ubicación)
const searchEvents = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Falta el término de búsqueda" });

    const regex = new RegExp(q, "i");

    const results = await Event.find({
      $or: [
        { title: regex },
        { description: regex },
        { location: regex },
      ],
    })
      .sort({ date: -1 })
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

    res.status(200).json(results);
  } catch (error) {
    console.error("Error al buscar eventos:", error);
    res.status(500).json({ message: "Error al buscar eventos", error });
  }
};

// ✅ Confirmar asistencia
const attendEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ message: "Evento no encontrado" });

    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: "Ya estás anotado a este evento" });
    }

    event.attendees.push(userId);
    await event.save();

    res.status(200).json({ message: "Asistencia confirmada", event });
  } catch (error) {
    console.error("Error al confirmar asistencia:", error);
    res.status(500).json({ message: "Error al asistir al evento", error });
  }
};

// ✅ Cancelar asistencia
const removeAttendance = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Evento no encontrado" });

    if (!event.attendees.includes(userId)) {
      return res.status(400).json({ message: "No estás registrado en este evento" });
    }

    event.attendees = event.attendees.filter(
      (attendeeId) => attendeeId.toString() !== userId
    );

    await event.save();
    res.status(200).json({ message: "Asistencia cancelada correctamente", event });
  } catch (error) {
    console.error("Error al cancelar asistencia:", error);
    res.status(500).json({ message: "Error al cancelar asistencia", error });
  }
};

// ✅ Obtener evento por ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("attendees", "name email");

    if (!event) return res.status(404).json({ message: "Evento no encontrado" });

    res.status(200).json(event);
  } catch (error) {
    console.error("Error al obtener evento por ID:", error);
    res.status(500).json({ message: "Error al obtener evento por ID", error });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  searchEvents,
  attendEvent,
  removeAttendance,
  getEventById,
};
