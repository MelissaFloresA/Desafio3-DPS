# 📦 GM Stock - Sistema de Inventario Inteligente

## 📱 Descripción del Proyecto
**GM Stock** es una aplicación móvil completa para gestión de inventario que combina un backend seguro con **API REST** y un frontend en **React Native**.  
El sistema permite escanear códigos QR de productos, consultar stock y actualizar inventario en tiempo real.



![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/Bcrypt-0033A0?style=for-the-badge&logo=lock&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Visual Studio Code](https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)

---
## Características

- ✅ Autenticación JWT
- ✅ Gestión de usuarios (registro y login)
- ✅ CRUD completo de productos
- ✅ Base de datos MongoDB
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Endpoint de health check

## 🏗️ Arquitectura del Sistema

```
Desafio3-DPS/
├── backend/
|   ├── src/
│   ├── config/
│   │   └── db.js                 # Conexión MongoDB
│   ├── controllers/
│   │   ├── authController.js     # Lógica de autenticación
│   │   └── productController.js  # Lógica de productos
│   ├── models/
│   │   ├── Usuarios.js          # Modelo de usuarios
│   │   └── Productos.js         # Modelo de productos
│   ├── routes/
│   │   ├── auth.js              # Rutas de autenticación
│   │   └── products.js          # Rutas de productos
│   ├── middlewares/
│   │   └── verificarToken.js    # Middleware de autenticación
│   ├── app.js                   # Configuración Express
│   └── server.js                # Servidor principal
|   └── package.json
├── frontend/
|   ├── src/
│   ├── screens/                 # Pantallas de la app
│   │   ├── LoginScreen.js       # Pantalla de inicio de sesión
│   │   ├── RegisterScreen.js    # Pantalla de registro
│   │   ├── HomeScreen.js        # Pantalla principal
│   │   ├── ProductsScreen.js    # Lista de productos
│   │   ├── ScanScreen.js        # Escáner QR
│   │   └── ProductDetailScreen.js # Detalle de producto
│   ├── services/
│   │   ├── api.js              # Configuración Axios
│   │   └── auth.js             # Servicios de autenticación
│   ├── context/
│   │   └── AuthContext.js      # Contexto de autenticación
│   ├── utils/
│   │   └── constants.js        # Constantes y configuraciones
│   └── styles/
│       └── globalStyles.js     # Estilos globales
│   ├── assets/                     # Recursos (imágenes, fuentes)
│   ├── package.json
├── qrs/ #carpeta de codigos qr que se genera automáticamente
└── README.md
```


## Tecnologías

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **dotenv** - Variables de entorno

## Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB
- npm o yarn

### Variables de Entorno
Crear archivo `.env` en la backend

```env
MONGO_URI=mongodb://localhost:27017/inventario
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=10
DEPLOYMENT_PORT=3000
```
###  💻 Frontend Setup
Editar archivo frontend/src/utils/constants.js
```
# Windows para saber ip del dispositivo
ipconfig

# Mac/Linux
ifconfig
```
```bash
// PARA DISPOSITIVO FÍSICO - Cambiar por tu IP local
export const API_BASE_URL = 'http://#.#.#.#:3000/api';
```

### 🛠️ Comandos de Desarrollo
```bash
# Desarrollo con auto-reload
cd backend
npm install
npm run dev

# Producción en otra terminal
cd frontend
npm install
npm start
```
---

## Endpoints de la API

### 🔐 Autenticación

#### POST /api/auth/register
Registra un nuevo usuario en el sistema.

**Body:**
```json
{
  "usuario": "nombreusuario",
  "password": "contraseña123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "usuario": "nombreusuario"
  }
}
```

**Errores:**
- `400` - Campos requeridos faltantes
- `401` - Usuario ya existe
- `500` - Error del servidor

#### POST /api/auth/login
Autentica un usuario y retorna token JWT.

**Body:**
```json
{
  "usuario": "nombreusuario",
  "password": "contraseña123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "usuario": "nombreusuario"
  }
}
```

**Errores:**
- `400` - Campos requeridos faltantes
- `401` - Credenciales inválidas
- `500` - Error del servidor

### 📦 Productos

*Todos los endpoints de productos requieren autenticación JWT*

#### POST /api/products/crear
Crea un nuevo producto en el inventario.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Body:**
```json
{
  "nombre": "Producto Ejemplo",
  "categoria": "Electrónicos",
  "qr": "codigo_qr_unico",
  "precio": 99.99,
  "stock": 50
}
```

**Respuesta Exitosa (201):**
```json
{
  "_id": "product_id",
  "nombre": "Producto Ejemplo",
  "categoria": "Electrónicos",
  "qr": "codigo_qr_unico",
  "precio": 99.99,
  "stock": 50,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errores:**
- `400` - Campos requeridos faltantes
- `500` - Error del servidor

#### GET /api/products/obtener
Obtiene todos los productos del inventario.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Respuesta Exitosa (200):**
```json
[
  {
    "_id": "product_id",
    "nombre": "Producto Ejemplo",
    "categoria": "Electrónicos",
    "qr": "codigo_qr_unico",
    "precio": 99.99,
    "stock": 50,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Errores:**
- `500` - Error del servidor

#### GET /api/products/obtener/:id
Obtiene un producto específico por su ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parámetros:**
- `id` - ID del producto (requerido)

**Respuesta Exitosa (200):**
```json
{
  "_id": "product_id",
  "nombre": "Producto Ejemplo",
  "categoria": "Electrónicos",
  "qr": "codigo_qr_unico",
  "precio": 99.99,
  "stock": 50,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errores:**
- `404` - Producto no encontrado
- `500` - Error del servidor

#### POST /api/products/actualizar/:id
Actualiza el stock de un producto específico.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parámetros:**
- `id` - ID del producto (requerido)

**Body:**
```json
{
  "stock": 25
}
```

**Respuesta Exitosa (200):**
```json
{
  "_id": "product_id",
  "nombre": "Producto Ejemplo",
  "categoria": "Electrónicos",
  "qr": "codigo_qr_unico",
  "precio": 99.99,
  "stock": 25,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errores:**
- `404` - Producto no encontrado
- `500` - Error del servidor

### 🩺 Health Check

#### GET /health
Verifica el estado del servidor.

**Respuesta Exitosa (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600.25
}
```

## Modelos de Datos

### Usuario
```javascript
{
  _id: ObjectId,
  usuario: String (único, requerido),
  password: String (hasheado, requerido),
  token: String (JWT actual)
}
```

### Producto
```javascript
{
  _id: ObjectId,
  nombre: String (requerido),
  categoria: String (requerido),
  qr: String (único, requerido),
  precio: Number (requerido),
  stock: Number (requerido),
  createdAt: Date,
  updatedAt: Date
}
```

## Seguridad

- **JWT**: Tokens firmados con secreto configurable
- **bcrypt**: Contraseñas hasheadas con salt rounds configurable
- **Validación**: Campos requeridos y tipos de datos
- **Mensajes de error genéricos**: No se revela información sensible en errores

## Manejo de Errores

La API utiliza códigos HTTP estándar:

- `200` - Éxito
- `201` - Recurso creado
- `400` - Solicitud incorrecta
- `401` - No autorizado
- `404` - Recurso no encontrado
- `500` - Error interno del servidor

## Ejemplos de Uso

### Flujo típico:

1. **Registro/Login**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"usuario":"testuser","password":"testpass"}'
```

2. **Crear Producto**
```bash
curl -X POST http://localhost:3000/api/products/crear \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{"nombre":"Laptop","categoria":"Electrónicos","qr":"QR123","precio":999.99,"stock":10}'
```

3. **Obtener Productos**
```bash
curl -X GET http://localhost:3000/api/products/obtener \
  -H "Authorization: Bearer <jwt_token>"
```

## Desarrollo

### Scripts disponibles:
```bash
npm start    # Inicia en producción
npm run dev  # Inicia en desarrollo (con nodemon)
```

### Puerto por defecto:
- Desarrollo: `3000`
- Configurable via variable de entorno `DEPLOYMENT_PORT`

---
## 🔍 Escaneo QR
- Lector de códigos QR integrado  
- Búsqueda instantánea de productos por ID  
- Actualización directa desde el escaneo  

## 🎨 Diseño y UX
- Interfaz con colores corporativos (azul celeste, dorado, gris)  
- Navegación intuitiva entre pantallas  
- Feedback visual inmediato  
- Diseño responsive para móviles  

## 📄 Licencia
Este proyecto está desarrollado para fines educativos y de demostración.

## 👥 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)

---

