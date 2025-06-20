import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ForgotPasswordUseCase } from 'src/application/use-case/auth/forgot-password.use-case';
import { LoginUseCase } from 'src/application/use-case/auth/login.use-case';
import { LogoutUseCase } from 'src/application/use-case/auth/logout.use-case';
import { RefreshTokenUseCase } from 'src/application/use-case/auth/refresh-token.use-case';
import { RegisterUseCase } from 'src/application/use-case/auth/register.use-case';
import { ResetPasswordUseCase } from 'src/application/use-case/auth/reset-password.use-case';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt.auth.guard';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { AuthController } from 'src/interfaces/controllers/auth.controller';
import { BcryptPasswordService } from 'src/infrastructure/services/bcrypt-password.service';
import { PrismaPasswordResetRepository } from 'src/infrastructure/repositories/auth/prisma-password-reset.repository';
import { NestJsJwtService } from 'src/infrastructure/services/nest-jwt.service';
import { BrevoEmailService } from 'src/infrastructure/services/brevo-email.service';
import { PrismaUserRepository } from 'src/infrastructure/repositories/auth/prisma-user.repository';
import { PrismaRefreshTokenRepository } from 'src/infrastructure/repositories/auth/prisma-refresh-token.repository';

// Use Cases

@Module({
  imports: [ConfigModule, JwtModule.register({}), PrismaModule],
  controllers: [AuthController],
  providers: [
    // Use Cases
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    LogoutUseCase,
    // Guards
    JwtAuthGuard,
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
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
