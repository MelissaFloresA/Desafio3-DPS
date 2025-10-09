const QRCode = require('qrcode');
const mongoose = require('mongoose');
const Productos = require('./src/models/Productos');
require('dotenv').config();

const generarQRsParaProductos = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Obtener todos los productos
    const productos = await Productos.find();
    console.log(`📦 Encontrados ${productos.length} productos`);

    // Crear carpeta para QR si no existe
    const fs = require('fs');
    const qrFolder = './qrs';
    if (!fs.existsSync(qrFolder)) {
      fs.mkdirSync(qrFolder);
      console.log('📁 Carpeta "qrs" creada');
    }

    // Generar QR para cada producto
    for (const producto of productos) {
      const idProducto = producto._id.toString();
      
      // 🔥 CORRECCIÓN: Limpiar nombre para archivo (remover caracteres inválidos)
      const nombreLimpio = producto.nombre
        .replace(/[<>:"/\\|?*]/g, '') // Remover caracteres inválidos
        .replace(/\s+/g, '-')         // Reemplazar espacios con guiones
        .substring(0, 50);            // Limitar longitud
      
      const nombreArchivo = `producto-${nombreLimpio}.png`;
      const qrPath = `${qrFolder}/${nombreArchivo}`;
      
      // Configuración del QR
      const opciones = {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      };
      
      try {
        // Generar el QR
        await QRCode.toFile(qrPath, idProducto, opciones);
        
        console.log(`✅ QR generado: ${nombreArchivo}`);
        console.log(`   📝 Producto: ${producto.nombre}`);
        console.log(`   🔑 ID: ${idProducto}`);
        console.log(`   📁 Guardado en: ${qrPath}`);
        console.log('   ---');
      } catch (qrError) {
        console.error(`❌ Error generando QR para ${producto.nombre}:`, qrError.message);
      }
    }
    
    console.log('\n🎉 ¡PROCESO COMPLETADO!');
    console.log('📂 Los QR están en: backend/qrs/');
    console.log('📱 Escanea los QR con tu app móvil');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar el script
generarQRsParaProductos();