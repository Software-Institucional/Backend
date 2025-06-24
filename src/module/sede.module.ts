import { Module } from '@nestjs/common';
import { CreateSedeUseCase } from 'src/application/use-case/sede/create-sede.use-case';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { PrismaSedeRepository } from 'src/infrastructure/repositories/sede/prisma-sede.repository';
import { SedeController } from 'src/interfaces/controllers/sede.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SedeController],
  providers: [
    CreateSedeUseCase,
    {
      provide: 'SedeRepository',
      useClass: PrismaSedeRepository,
    },
  ],
})
export class SedeModule {}
