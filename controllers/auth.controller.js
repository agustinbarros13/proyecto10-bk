const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Registro de nuevo usuario
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado." });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({
      message: "Usuario registrado correctamente.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el registro", error });
  }
};

// Login de usuario existente
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = generateToken(user);
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // También buscamos los eventos a los que asiste
    const Event = require("../models/Event");
    const attendingEvents = await Event.find({ attendees: user._id });

    res.status(200).json({
      user,
      attendingEvents,
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ message: "Error al obtener perfil", error });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
