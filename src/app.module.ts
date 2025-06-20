import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { AuthModule } from './module/auth.module';
import { SchoolModule } from './module/school.module';

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
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
