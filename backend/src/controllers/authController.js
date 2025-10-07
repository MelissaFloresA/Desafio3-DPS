// src/controllers/authController.js
const Usuario = require("../models/Usuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');


const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

exports.login = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    if (!usuario || !password) {
      return res.status(400).json({ message: "usuario y password son requeridos" });
    }

    const elemento = await Usuario.findOne({ usuario: usuario.toLowerCase() });
    if (!elemento) {
      // No dar pistas (no "usuario no existe")
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // comparar contraseña con bcrypt
    const match = await bcrypt.compare(password, elemento.password);
    if (!match) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // payload mínimo
    const payload = {
      sub: elemento._id.toString(),
      usuario: elemento.usuario
    };

    if (!JWT_SECRET) {
      // No permitir firmar tokens sin secreto
      return res.status(500).json({ message: "JWT_SECRET no está configurado en el entorno del servidor" });
    }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Guardar el token en la base de datos
    elemento.token = token;
    await elemento.save();

    // Respuesta: token + información básica (sin campos sensibles)
    res.json({
      token,
      user: {
        id: elemento._id,
        usuario: elemento.usuario,
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};






exports.register = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    if (!usuario || !password) {
      return res.status(400).json({ message: "usuario y password son requeridos" });
    }

    const elemento = await Usuario.findOne({ usuario: usuario.toLowerCase() });
    if (elemento) {
      // No dar pistas (no "usuario no existe")
      return res.status(401).json({ message: "El usuario ya existe" });
    }

    // crear usuario con password hasheado
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const hashed = await bcrypt.hash(password, saltRounds);
    const id = new mongoose.Types.ObjectId();

    if (!JWT_SECRET) {
      // No permitir firmar tokens sin secreto
      return res.status(500).json({ message: "JWT_SECRET no está configurado en el entorno del servidor" });
    }

    const payload = {
      sub: id,
      usuario: usuario
    };

    //crear token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    //creamos el usuario
    await Usuario.create({
      _id: id,
      usuario: usuario,
      password: hashed,
      token: token
    });

 



    // Respuesta: token + información básica (sin campos sensibles)
    res.json({
      token,
      user: {
        id: id,
        usuario: usuario,
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};
