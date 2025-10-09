const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 INICIANDO CONFIGURACIÓN AUTOMÁTICA...\n');

try {
  // 1. Insertar productos
  console.log('📦 Insertando productos de ejemplo...');
  execSync('node insertar-productos.js', { stdio: 'inherit' });
  
  console.log('\n🔗 Generando códigos QR...');
  // 2. Generar QR
  execSync('node generar-qrs.js', { stdio: 'inherit' });
  
  console.log('\n✅ CONFIGURACIÓN COMPLETADA!');
  console.log('📂 Los QR están en: backend/qrs/');
  console.log('🌐 Accesibles via: http://localhost:3000/qrs/');
  console.log('\n🚀 Ahora ejecuta: npm run dev');
  
} catch (error) {
  console.error('❌ Error en la configuración:', error);
}