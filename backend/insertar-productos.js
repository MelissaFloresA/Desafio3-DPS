const mongoose = require('mongoose');
const Productos = require('./src/models/Productos');
require('dotenv').config();

const insertarProductosEjemplo = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Datos de ejemplo
    const productosEjemplo = [
      {
        nombre: "Laptop HP Pavilion",
        categoria: "Tecnología",
        qr: "LPTHP-001-2024",
        precio: 899.99,
        stock: 15
      },
      {
        nombre: "Smartphone Samsung Galaxy S23",
        categoria: "Tecnología", 
        qr: "SSGS23-002-2024",
        precio: 749.99,
        stock: 25
      },
      {
        nombre: "Auriculares Sony WH-1000XM4",
        categoria: "Audio",
        qr: "SONYWH-003-2024",
        precio: 299.99,
        stock: 30
      },
      {
        nombre: "Tablet iPad Air",
        categoria: "Tecnología",
        qr: "IPADAIR-004-2024",
        precio: 599.99,
        stock: 12
      },
      {
        nombre: 'Smart TV LG 55" 4K',
        categoria: "Electrodomésticos",
        qr: "LGT55-005-2024", 
        precio: 549.99,
        stock: 8
      }
    ];

    // Limpiar productos existentes
    await Productos.deleteMany({});
    console.log('🗑️ Productos existentes eliminados');

    // Insertar nuevos productos
    await Productos.insertMany(productosEjemplo);
    console.log('✅ 5 productos de ejemplo insertados:');
    
    productosEjemplo.forEach((producto, index) => {
      console.log(`   ${index + 1}. ${producto.nombre} - Stock: ${producto.stock}`);
    });

    console.log('\n🎉 Base de datos lista con datos de ejemplo!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
    process.exit(0);
  }
};

insertarProductosEjemplo();