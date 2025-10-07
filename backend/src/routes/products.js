// src/routes/productos.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verificarToken = require("../middlewares/verificarToken");


router.post("/crear", verificarToken, productController.crearProducto);

router.get("/obtener", verificarToken, productController.obtenerProductos);

router.get("/obtener/:id", verificarToken, productController.obtenerProductoPorId);

router.post("/actualizar/:id", verificarToken, productController.actualizarStockProducto);

module.exports = router;