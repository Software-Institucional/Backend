import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { AuthModule } from './module/auth.module';
import { SchoolModule } from './module/school.module';
import { SedeModule } from './module/sede.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './module/user.module';
import { SimatModule } from './module/simat.module';
import { GradoSedeModule } from './module/grado-sede.module';
import { CursoModule } from './module/curso.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      expandVariables: true,
      validationOptions: {
        abortEarly: true,
      },
    }),
    AuthModule,
    SchoolModule,
    SedeModule,
    UserModule,
    CursoModule,
    SimatModule,
    GradoSedeModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
