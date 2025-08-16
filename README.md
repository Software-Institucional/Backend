# 🏫 Backend Software - Sistema de Gestión Académica

Sistema backend robusto para la gestión de instituciones educativas, construido con NestJS y siguiendo principios de Clean Architecture.

## 🚀 Características Principales

- **Autenticación JWT** con refresh tokens y cookies seguras
- **Gestión de Usuarios** con roles y permisos
- **Administración de Colegios** y sedes
- **Gestión de Cursos y Grados** por sede
- **Integración con SIMAT** para sincronización de datos
- **Almacenamiento en S3** para archivos e imágenes
- **Sistema de Emails** con Brevo
- **Base de Datos** con Prisma ORM
- **Documentación API** con Swagger

## 🏗️ Arquitectura del Proyecto

```
src/
├── application/          # Capa de Aplicación
│   ├── use-case/        # Casos de uso de negocio
│   └── dtos/            # Data Transfer Objects
├── domain/               # Capa de Dominio
│   ├── entities/        # Entidades de negocio
│   ├── repositories/    # Interfaces de repositorios
│   ├── services/        # Servicios de dominio
│   └── exceptions/      # Excepciones personalizadas
├── infrastructure/       # Capa de Infraestructura
│   ├── prisma/          # Configuración de base de datos
│   ├── repositories/    # Implementaciones de repositorios
│   ├── s3/              # Servicio de almacenamiento
│   └── services/        # Servicios externos
├── interfaces/           # Capa de Interfaces
│   ├── controllers/     # Controladores HTTP
│   └── guards/          # Guards de autenticación
└── main.ts              # Punto de entrada
```

## 🛠️ Tecnologías Utilizadas

- **Framework**: NestJS 11
- **Lenguaje**: TypeScript 5.7
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT con Passport
- **Documentación**: Swagger/OpenAPI
- **Almacenamiento**: AWS S3
- **Email**: Brevo (Sendinblue)
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## 📋 Prerrequisitos

- Node.js 18+ 
- PostgreSQL 12+
- AWS S3 (opcional para desarrollo local)
- Cuenta en Brevo para emails

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Software-Institucional/Backend.git
cd backend-software
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. **Configurar base de datos**
```bash
# Crear base de datos PostgreSQL
npx prisma migrate dev
npx prisma generate
```

5. **Ejecutar el proyecto**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 🔧 Scripts Disponibles

```bash
npm run start:dev      # Desarrollo con hot reload
npm run start:debug    # Desarrollo con debug
npm run start:prod     # Producción
npm run build          # Compilar proyecto
npm run test           # Ejecutar tests
npm run test:e2e       # Tests end-to-end
npm run lint           # Linting y formateo
npm run format         # Formateo de código
```

## 📚 Documentación de la API

La documentación completa de la API está disponible en:
- **Swagger UI**: `http://localhost:3000/api` (desarrollo)
- **Notion**: [Documentación Completa](link-a-notion)

### Endpoints Principales

#### 🔐 Autenticación (`/auth`)
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `POST /auth/login-super` - Login como super usuario
- `POST /auth/refresh-token` - Renovar token
- `POST /auth/logout` - Cerrar sesión
- `POST /auth/forgot-password` - Recuperar contraseña
- `PUT /auth/reset-password` - Restablecer contraseña

#### 🏫 Colegios (`/schools`)
- `POST /schools` - Crear colegio
- `GET /schools` - Buscar colegios
- `PATCH /schools/:id` - Actualizar colegio
- `DELETE /schools/:id` - Eliminar colegio

#### 🏢 Sedes (`/sedes`)
- `POST /sedes` - Crear sede
- `GET /sedes` - Listar sedes
- `PUT /sedes/:id` - Actualizar sede
- `DELETE /sedes/:id` - Eliminar sede

#### 📚 Cursos y Grados
- `POST /cursos` - Crear curso
- `GET /cursos` - Listar cursos
- `POST /grado-sede` - Asignar grado a sede
- `GET /grado-sede` - Listar grados por sede

#### 👥 Usuarios (`/users`)
- `GET /users` - Listar usuarios
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

## 🔐 Autenticación

El sistema utiliza JWT con refresh tokens almacenados en cookies HTTP-only:

- **Access Token**: 24 horas, almacenado en cookie no-HTTP-only
- **Refresh Token**: 7 días, almacenado en cookie HTTP-only
- **Cookies seguras**: Configuradas automáticamente según el entorno

## 🗄️ Base de Datos

### Modelos Principales

- **User**: Usuarios del sistema con roles
- **School**: Instituciones educativas
- **Sede**: Sedes de los colegios
- **GradoSede**: Grados disponibles por sede
- **Curso**: Cursos ofrecidos
- **Student**: Estudiantes sincronizados desde SIMAT

### Migraciones

```bash
# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (solo desarrollo)
npx prisma migrate reset
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# Tests end-to-end
npm run test:e2e

# Tests en modo watch
npm run test:watch
```

## 📦 Despliegue

### Variables de Entorno Requeridas

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT
JWT_SECRET="tu-secreto-jwt"
JWT_REFRESH_SECRET="tu-secreto-refresh"

# AWS S3
AWS_ACCESS_KEY_ID="tu-access-key"
AWS_SECRET_ACCESS_KEY="tu-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="tu-bucket"

# Brevo (Email)
BREVO_API_KEY="tu-api-key-brevo"

# SIMAT
SIMAT_USERNAME="usuario-simat"
SIMAT_PASSWORD="password-simat"
```

### Docker (Opcional)

```bash
# Construir imagen
docker build -t backend-software .

# Ejecutar contenedor
docker run -p 3000:3000 backend-software
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y no está licenciado para uso público.

## 👨‍💻 Equipo de Desarrollo

- **Santiago Suescun** - Desarrollador Backend
- **James Galviz** - Desarrollador Frontend

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

**Versión**: 0.0.1  
**Última actualización**: Diciembre 2024
