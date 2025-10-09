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

    //Verificar si el token coincide con el guardado en BD
    if (usuario.token !== token) {
      console.log('❌ Token no coincide con BD'); // 🔥 DEBUG
      return res.status(401).json({ message: "Token inválido o expirado" });
    }

    // 5️⃣ Adjuntar datos del usuario al request
    req.usuario = usuario;
    next();

  } catch (err) {
    console.error("❌ Error al verificar token:", err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expirado" });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token inválido" });
    }
    
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = verificarToken;