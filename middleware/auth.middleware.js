const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Extraemos el token del header Authorization
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    // Verificamos si el token es válido y lo decodificamos
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario en la request
    next(); // Continuamos con la siguiente función (controlador)
  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
};

module.exports = verifyToken;
