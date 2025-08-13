import { Module } from '@nestjs/common';
import { CreateCustomGradoSedeUseCase } from 'src/application/use-case/grado/create-custom-grado.use-case';
import { ListGradosSedeNivelUseCase } from 'src/application/use-case/grado/list-grados-sede.use-case';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { PrismaGradoSedeRepository } from 'src/infrastructure/repositories/prisma-grado-sede.repository';
import { GradoSedeController } from 'src/interfaces/controllers/grado-sede.controller';
import { CoreModule } from './core/core.module';
import { InitGradosSedeNivelUseCase } from 'src/application/use-case/grado/init-grados-sede-nivel.use-case';
import { SetActivoGradoSedeUseCase } from 'src/application/use-case/grado/set-activo-grado-sede.use-case';
import { DeleteGradoSedeUseCase } from 'src/application/use-case/grado/delete-grado-sede-use-case';

@Module({
  imports: [CoreModule],
  controllers: [GradoSedeController],
  providers: [
    PrismaService,
    // UseCases
    CreateCustomGradoSedeUseCase,
    ListGradosSedeNivelUseCase,
    InitGradosSedeNivelUseCase,
    SetActivoGradoSedeUseCase,
    DeleteGradoSedeUseCase,

    // Repositorios
    {
      provide: 'GradoSedeRepository',
      useClass: PrismaGradoSedeRepository,
    },
  ],
  exports: [
    // Por si necesitas usar los casos de uso o el repo en otros módulos
    CreateCustomGradoSedeUseCase,
    ListGradosSedeNivelUseCase,
    InitGradosSedeNivelUseCase,
    SetActivoGradoSedeUseCase,
    DeleteGradoSedeUseCase,

    {
      provide: 'GradoSedeRepository',
      useClass: PrismaGradoSedeRepository,
    },
  ],
})
export class GradoSedeModule {}
