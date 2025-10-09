const app = require('./app');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const Productos = require('./models/Productos');
const fs = require('fs');
const path = require('path');
const PORT = process.env.DEPLOYMENT_PORT || 3000;

// Datos de ejemplo para insertar automáticamente
const productosEjemplo = [
  // Productos originales
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
  },
  // Nuevos productos - Accesorios de computadora económicos
  {
    nombre: "Mouse Inalambrico Logitech M170",
    categoria: "Accesorios",
    qr: "MOUSELOG-006-2024",
    precio: 19.99,
    stock: 50
  },
  {
    nombre: "Teclado Mecanico Redragon Kumara",
    categoria: "Accesorios",
    qr: "TECLRED-007-2024",
    precio: 49.99,
    stock: 25
  },
  {
    nombre: "Mousepad Gamer Grande",
    categoria: "Accesorios",
    qr: "PADGAM-008-2024",
    precio: 3.99,
    stock: 40
  },
  {
    nombre: "Webcam Logitech C920",
    categoria: "Accesorios",
    qr: "WEBCAM-009-2024",
    precio: 79.99,
    stock: 20
  },
  {
    nombre: "Auriculares Gamer HyperX Cloud Stinger",
    categoria: "Audio",
    qr: "AUDGAM-010-2024",
    precio: 49.99,
    stock: 35
  },
  {
    nombre: "Hub USB 3.0 4 Puertos",
    categoria: "Accesorios",
    qr: "HUBUSB-011-2024",
    precio: 15.99,
    stock: 60
  },
  {
    nombre: "Soporte para Laptop Ajustable",
    categoria: "Accesorios",
    qr: "SOPLAP-012-2024",
    precio: 29.99,
    stock: 30
  },
  {
    nombre: "Cable HDMI 2.0 2 Metros",
    categoria: "Cables",
    qr: "HDMI2M-013-2024",
    precio: 8.99,
    stock: 100
  },
  {
    nombre: "Disco Duro Externo 1TB Seagate",
    categoria: "Almacenamiento",
    qr: "DD1TB-014-2024",
    precio: 59.99,
    stock: 18
  },
  {
    nombre: "Memoria USB 64GB Sandisk",
    categoria: "Almacenamiento",
    qr: "USB64G-015-2024",
    precio: 12.99,
    stock: 45
  },
  {
    nombre: "Cooler para Laptop",
    categoria: "Accesorios",
    qr: "COOLLAP-016-2024",
    precio: 23.99,
    stock: 28
  },
  {
    nombre: "Adaptador USB-C a HDMI",
    categoria: "Cables",
    qr: "ADPUSBC-017-2024",
    precio: 9.99,
    stock: 35
  },
  {
    nombre: "Funda para Laptop 15.6",
    categoria: "Accesorios",
    qr: "FUNDLAP-018-2024",
    precio: 22.99,
    stock: 42
  },
  {
    nombre: "Kit de Limpieza para Computadora",
    categoria: "Accesorios",
    qr: "KITLIM-019-2024",
    precio: 9.99,
    stock: 55
  },
  {
    nombre: "Filtro de Luz Azul para Monitor",
    categoria: "Accesorios",
    qr: "FILAZUL-020-2024",
    precio: 14.99,
    stock: 38
  }
];

// Función para crear carpeta qrs si no existe
const crearCarpetaQRs = () => {
  const qrFolder = path.join(__dirname, '../../qrs');
  if (!fs.existsSync(qrFolder)) {
    fs.mkdirSync(qrFolder, { recursive: true });
    console.log('Carpeta qrs creada');
  }
  return qrFolder;
};

// Función para insertar datos de ejemplo
const insertarDatosEjemplo = async () => {
  try {
    // Verificar si ya existen productos
    const count = await Productos.countDocuments();
    
    if (count === 0) {
      console.log('Insertando productos de ejemplo...');
      await Productos.insertMany(productosEjemplo);
      console.log(productosEjemplo.length + ' productos de ejemplo insertados');
      
      // Generar QR automáticamente
      await generarQRsAutomaticos();
    } else {
      console.log('Ya existen ' + count + ' productos en la base de datos');
      // Verificar y generar QR si no existen
      await verificarYGenerarQRs();
    }
  } catch (error) {
    console.error('Error insertando datos de ejemplo:', error.message);
  }
};

// Función para verificar y generar QR si no existen
const verificarYGenerarQRs = async () => {
  try {
    const qrFolder = crearCarpetaQRs();
    const productos = await Productos.find();
    
    // Verificar cuántos QR faltan
    let qrsFaltantes = 0;
    for (const producto of productos) {
      const nombreLimpio = producto.nombre
        .replace(/[<>:"/\\|?*]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
      const nombreArchivo = `producto-${nombreLimpio}.png`;
      const qrPath = path.join(qrFolder, nombreArchivo);
      
      if (!fs.existsSync(qrPath)) {
        qrsFaltantes++;
      }
    }
    
    if (qrsFaltantes > 0) {
      console.log('Generando ' + qrsFaltantes + ' QR faltantes...');
      await generarQRsAutomaticos();
    } else {
      console.log('Todos los QR ya estan generados');
    }
    
  } catch (error) {
    console.error('Error verificando QR:', error.message);
  }
};

// Función para generar QR automáticamente
const generarQRsAutomaticos = async () => {
  try {
    const QRCode = require('qrcode');
    const qrFolder = crearCarpetaQRs();
    
    // Obtener todos los productos
    const productos = await Productos.find();
    
    console.log('Generando codigos QR...');
    
    let qrsGenerados = 0;
    for (const producto of productos) {
      const idProducto = producto._id.toString();
      
      // Limpiar nombre para archivo
      const nombreLimpio = producto.nombre
        .replace(/[<>:"/\\|?*]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
      
      const nombreArchivo = `producto-${nombreLimpio}.png`;
      const qrPath = path.join(qrFolder, nombreArchivo);
      
      // Solo generar si no existe
      if (!fs.existsSync(qrPath)) {
        // Configuración del QR
        const opciones = {
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        };
        
        // Generar el QR
        await QRCode.toFile(qrPath, idProducto, opciones);
        qrsGenerados++;
      }
    }
    
    if (qrsGenerados > 0) {
      console.log('QRs generados correctamente: ' + qrsGenerados + ' archivos');
    }
    
  } catch (error) {
    console.error('Error generando QR:', error.message);
  }
};

// Función principal para iniciar el servidor
const iniciarServidor = async () => {
  try {
    // Crear carpeta qrs primero
    crearCarpetaQRs();
    
    // Conectar a la base de datos
    await connectDB();
    
    // Insertar datos de ejemplo si es la primera vez
    await insertarDatosEjemplo();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('Servidor corriendo en http://localhost:' + PORT);
      console.log('Health check: http://localhost:' + PORT + '/health');
      console.log('QR disponibles: http://localhost:' + PORT + '/qrs/');
    });
    
  } catch (error) {
    console.error('Error iniciando servidor:', error);
    process.exit(1);
  }
};

// Manejo de graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

// Iniciar la aplicación
iniciarServidor();