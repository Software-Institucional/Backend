import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './domain/exceptions/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

export const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.56.1:3000',
  'https://www.eduadminsoft.shop',
  'https://api.eduadminsoft.shop',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar cookie-parser
  app.use(cookieParser());

  // Configuración de CORS mejorada
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Permitir requests sin origin (ej: aplicaciones móviles, Postman)
      if (!origin) return callback(null, true);

      // Verificar si el origin está en la lista permitida
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Permitir localhost en cualquier puerto para desarrollo
      if (origin.match(/^http:\/\/localhost:\d+$/)) {
        return callback(null, true);
      }

      // Permitir 127.0.0.1 en cualquier puerto para desarrollo
      if (origin.match(/^http:\/\/127\.0\.0\.1:\d+$/)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, Cookie',
    exposedHeaders: 'Set-Cookie',
  });

  const config = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription(
      'Complete authentication system with hexagonal architecture',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
