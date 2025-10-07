const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  usuario: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  token: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Usuarios", usuarioSchema);
