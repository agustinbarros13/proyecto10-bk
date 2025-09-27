const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Registro de nuevo usuario
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificamos si el email ya está en uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado." });
    }

    // Creamos el nuevo usuario
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generamos token y lo devolvemos
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
    // Buscamos al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparamos contraseñas
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generamos y devolvemos token
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

module.exports = {
  register,
  login,
};
