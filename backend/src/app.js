require('dotenv').config();
const express = require('express');
const cors = require('cors');
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
    message: 'API funcionando',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products'
    }
  });
});

// Rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Manejo de rutas no encontradas - FORMA CORRECTA
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

module.exports = app;