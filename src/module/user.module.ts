import { Module } from '@nestjs/common';
import { UserController } from 'src/interfaces/controllers/user.controller';
import { UpdateMyProfileUseCase } from 'src/application/use-case/auth/update-my-profile.use-case';
import { CoreModule } from './core/core.module';
import { PrismaUserRepository } from 'src/infrastructure/repositories/prisma-user.repository';
import { S3Service } from 'src/infrastructure/s3/s3.service';
import { AuthService } from 'src/infrastructure/services/simat-login.service';

@Module({
  imports: [CoreModule],
  controllers: [UserController],
  providers: [
    UpdateMyProfileUseCase,
    PrismaUserRepository,
    S3Service,
    AuthService,
  ],
})
export class UserModule {}
