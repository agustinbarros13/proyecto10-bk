// src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No se proporcionó el token de autenticación" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Formato de token inválido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guardamos los datos en la request
    next();
  } catch (error) {
    console.error("Error en verifyToken:", error.message);
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

module.exports = verifyToken;
