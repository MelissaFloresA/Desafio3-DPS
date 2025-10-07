const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  qr: { type: String, required: true, unique: true },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Productos", productoSchema);
