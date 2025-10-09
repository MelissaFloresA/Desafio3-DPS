require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());

// SERVIR ARCHIVOS QR ESTÁTICAMENTE
app.use('/qrs', express.static(path.join(__dirname, '../../qrs')));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API info
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      qrs: '/qrs/[nombre-qr].png'
    }
  });
});

// Rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Ruta específica para listar QR disponibles
app.get('/qrs', (req, res) => {
  const fs = require('fs');
  const qrFolder = path.join(__dirname, '../../qrs');
  
  if (!fs.existsSync(qrFolder)) {
    return res.status(404).json({
      error: 'Carpeta de QR no encontrada',
      message: 'La carpeta qrs aun no ha sido creada'
    });
  }
  
  const archivos = fs.readdirSync(qrFolder);
  const qrs = archivos.filter(archivo => archivo.endsWith('.png'));
  
  res.json({
    message: 'QR disponibles',
    total: qrs.length,
    qrs: qrs.map(qr => ({
      nombre: qr,
      url: `/qrs/${qr}`
    }))
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    availableEndpoints: [
      'GET  /health',
      'GET  /api',
      'GET  /qrs',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET  /api/products/obtener',
      'GET  /api/products/obtener/:id',
      'POST /api/products/crear',
      'POST /api/products/actualizar/:id'
    ]
  });
});

module.exports = app;