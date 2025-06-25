import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateSedeUseCase } from 'src/application/use-case/sede/create-sede.use-case';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { PrismaSedeRepository } from 'src/infrastructure/repositories/sede/prisma-sede.repository';
import { PrismaUserRepository } from 'src/infrastructure/repositories/auth/prisma-user.repository';
import { SedeController } from 'src/interfaces/controllers/sede.controller';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt.auth.guard';
import { NestJsJwtService } from 'src/infrastructure/services/nest-jwt.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SedeController],
  providers: [
    CreateSedeUseCase,
    // Guards
    JwtAuthGuard,
    NestJsJwtService,
    {
      provide: 'SedeRepository',
      useClass: PrismaSedeRepository,
    },
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: [NestJsJwtService, JwtAuthGuard],
})
export class SedeModule {}
