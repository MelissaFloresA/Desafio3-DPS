const app = require('./app');
const connectDB = require('./config/db');
const PORT = process.env.DEPLOYMENT_PORT || 3000;


// Conectar a la base de datos
connectDB();


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});