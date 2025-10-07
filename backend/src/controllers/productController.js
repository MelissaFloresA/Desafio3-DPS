const Productos = require("../models/Productos");

exports.crearProducto = async (req, res) => {
  try {
    const { nombre, categoria, qr, precio, stock } = req.body;
    if (!nombre || !categoria || !qr || precio == null || stock == null) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    const nuevoProducto = new Productos({ nombre, categoria, qr, precio, stock });
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
    } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Productos.find();
    res.json(productos);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

exports.obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({ message: "ID no encontrada" });
    }
    const producto = await Productos.findById(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(producto);
    } catch (err) {
    console.error("Error al obtener producto:", err);
    res.status(500).json({ message: "Error del servidor" });
  } 
};

exports.actualizarStockProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const producto = await Productos.findById(id);
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    producto.stock = stock != null ? stock : producto.stock;
    await producto.save();
    res.json(producto);
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};