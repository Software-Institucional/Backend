// src/infrastructure/core/core.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Servicios y providers concretos
import { BcryptPasswordService } from 'src/infrastructure/services/bcrypt-password.service';
import { NestJsJwtService } from 'src/infrastructure/services/nest-jwt.service';
import { BrevoEmailService } from 'src/infrastructure/services/brevo-email.service';
import { S3Service } from 'src/infrastructure/s3/s3.service';

// Repositorios concretos
import { PrismaUserRepository } from 'src/infrastructure/repositories/prisma-user.repository';
import { PrismaRefreshTokenRepository } from 'src/infrastructure/repositories/prisma-refresh-token.repository';
import { PrismaPasswordResetRepository } from 'src/infrastructure/repositories/prisma-password-reset.repository';
import { PrismaSchoolRepository } from 'src/infrastructure/repositories/prisma-school.repository';
import { PrismaSedeRepository } from 'src/infrastructure/repositories/prisma-sede.repository';

// PrismaModule debe estar importado aquí si tus repositorios lo usan internamente
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { PrismaCursoRepository } from 'src/infrastructure/repositories/prisma-curso.repository';
import { PrismaStudentRepository } from 'src/infrastructure/repositories/prisma-student.repository';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
      }),
    }),
    PrismaModule,
  ],
  providers: [
    // Servicios globales
    {
      provide: 'PasswordService',
      useClass: BcryptPasswordService,
    },
    {
      provide: 'JwtService',
      useClass: NestJsJwtService,
    },
    {
      provide: 'EmailService',
      useClass: BrevoEmailService,
    },
    S3Service,

    // Repositorios globales
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'RefreshTokenRepository',
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: 'PasswordResetRepository',
      useClass: PrismaPasswordResetRepository,
    },
    {
      provide: 'SchoolRepository',
      useClass: PrismaSchoolRepository,
    },
    {
      provide: 'StudentRepository',
      useClass: PrismaStudentRepository,
    },
    {
      provide: 'SedeRepository',
      useClass: PrismaSedeRepository,
    },
    { provide: 'CursoRepository', useClass: PrismaCursoRepository },
  ],
  exports: [
    'PasswordService',
    'JwtService',
    'EmailService',
    'UserRepository',
    'CursoRepository',
    'StudentRepository',
    'RefreshTokenRepository',
    'PasswordResetRepository',
    'SchoolRepository',
    'SedeRepository',
    S3Service,
    JwtModule, // Si lo quieres usar directo (no es obligatorio)
    PrismaModule,
  ],
})
export class CoreModule {}
