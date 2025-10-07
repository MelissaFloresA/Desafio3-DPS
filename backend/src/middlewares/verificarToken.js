const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuarios"); 
const JWT_SECRET = process.env.JWT_SECRET;

const verificarToken = async (req, res, next) => {
  try {
    // 1️⃣ Verificar si el token viene en los headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Decodificar y verificar firma del token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3️⃣ Buscar al usuario en la base de datos
    const usuario = await Usuario.findById(decoded.sub);

    if (!usuario) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // 4️⃣ Verificar si el token coincide con el guardado en BD
    if (usuario.token !== token) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    // 5️⃣ Adjuntar datos del usuario al request
    req.usuario = usuario;
    next(); // continuar con la ruta

  } catch (err) {
    console.error("Error al verificar token:", err);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = verificarToken;
