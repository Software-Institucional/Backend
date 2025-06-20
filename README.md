src/
├── application/          # Casos de uso (application layer / use-cases)
│   ├── services/         # Servicios de aplicación (lógica de negocio)
│   └── dto/              # Data Transfer Objects
├── domain/               # Entidades, Value Objects, Interfaces (domain layer)
│   ├── entities/
│   ├── repositories/     # Contratos (interfaces) para repositorios
│   └── exceptions/       # Excepciones de dominio
├── infrastructure/       # Adaptadores (DB, servicios externos, S3, email...)
│   ├── prisma/           # Prisma Client (ORM)
│   ├── repositories/     # Implementaciones concretas de los repositorios
│   ├── s3/               # Servicio de S3 (por ejemplo)
│   └── config/           # Configuración (por ejemplo, configuración de prisma, S3, etc.)
├── interfaces/           # Controladores (API REST, GraphQL, WebSocket...)
│   ├── controllers/      # Controladores HTTP
│   ├── routes/           # Definición de rutas
│   └── dtos/             # Request DTOs
├── shared/               # Utils, helpers, constantes, types comunes
├── main.ts               # Bootstrap del proyecto
└── app.module.ts         # Módulo raíz



ejemplo 
src/
├── domain/
│   ├── entities/
│   │   └── user.entity.ts
│   ├── repositories/
│   │   └── user.repository.ts   // interface IUserRepository
├── application/
│   ├── services/
│   │   └── create-user.service.ts
│   └── dto/
│       └── create-user.dto.ts
├── infrastructure/
│   ├── prisma/
│   │   └── prisma.service.ts
│   ├── repositories/
│   │   └── prisma-user.repository.ts   // implements IUserRepository
├── interfaces/
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── dtos/
│   │   └── create-user.request.dto.ts
