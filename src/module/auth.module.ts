import { Module } from '@nestjs/common';
import { AuthController } from 'src/interfaces/controllers/auth.controller';
import { RegisterUseCase } from 'src/application/use-case/auth/register.use-case';
import { LoginUseCase } from 'src/application/use-case/auth/login.use-case';
import { RefreshTokenUseCase } from 'src/application/use-case/auth/refresh-token.use-case';
import { ForgotPasswordUseCase } from 'src/application/use-case/auth/forgot-password.use-case';
import { ResetPasswordUseCase } from 'src/application/use-case/auth/reset-password.use-case';
import { LogoutUseCase } from 'src/application/use-case/auth/logout.use-case';
import { AllUSerUseCase } from 'src/application/use-case/auth/all-user-register.use-case';
import { UpdateUserUseCase } from 'src/application/use-case/auth/update-user.use-case';
import { DeleteUserUseCase } from 'src/application/use-case/auth/celete-user.use-case';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [AuthController],
  providers: [
    // Solo los use cases propios del auth
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    LogoutUseCase,
    AllUSerUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
})
export class AuthModule {}
