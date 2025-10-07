# API de Inventario - Documentación

## Descripción

API RESTful para gestión de inventario con autenticación JWT. Permite realizar operaciones CRUD sobre productos y gestionar usuarios con autenticación segura.

## Características

- ✅ Autenticación JWT
- ✅ Gestión de usuarios (registro y login)
- ✅ CRUD completo de productos
- ✅ Base de datos MongoDB
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Endpoint de health check

## Tecnologías

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **dotenv** - Variables de entorno

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── productController.js
│   ├── models/
│   │   ├── Usuarios.js
│   │   └── Productos.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── products.js
│   ├── middlewares/
│   │    └── verificarToken.js
│   ├── app.js
│   └── server.js
│

```

## Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB
- npm o yarn

### Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:

```env
MONGO_URI=mongodb://localhost:27017/inventario
JWT_SECRET=tu_jwt_secret_muy_seguro
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=10
DEPLOYMENT_PORT=3000
```

### Instalación
```bash
# Instalar dependencias
npm install

# Iniciar servidor en desarrollo
npm run dev

# Iniciar servidor en producción
npm start
```

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

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.