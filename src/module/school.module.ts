import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CreateSchoolUseCase } from 'src/application/use-case/school/create-school.use-case';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt.auth.guard';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { PrismaSchoolRepository } from 'src/infrastructure/repositories/school/prisma-school.repository';
import { PrismaUserRepository } from 'src/infrastructure/repositories/auth/prisma-user.repository';
import { S3Module } from 'src/infrastructure/s3/s3.module';
import { NestJsJwtService } from 'src/infrastructure/services/nest-jwt.service';
import { SchoolController } from 'src/interfaces/controllers/school.controller';
import { SearchSchoolUseCase } from 'src/application/use-case/school/search-school.use-case';
import { UpdateSchoolRequestDto } from 'src/application/dtos/school.dtos';
import { UpdateSchoolUseCase } from 'src/application/use-case/school/update-school.use-case';

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
    S3Module,
  ],
  controllers: [SchoolController],
  providers: [
    ConfigService,
    CreateSchoolUseCase,
    SearchSchoolUseCase,
    UpdateSchoolUseCase,
    UpdateSchoolRequestDto,

    {
      provide: 'JwtService',
      useClass: NestJsJwtService,
    },
    {
      provide: 'SchoolRepository',
      useClass: PrismaSchoolRepository,
    },
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    JwtAuthGuard,
    NestJsJwtService,
  ],
  exports: [
    'JwtService',
    JwtAuthGuard,
    {
      provide: 'SchoolRepository',
      useClass: PrismaSchoolRepository,
    },
  ],
})
export class SchoolModule {}
