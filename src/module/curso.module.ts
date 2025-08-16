import { Module } from '@nestjs/common';
import {
  CreateCursoUseCase,
  DeleteCursoUseCase,
  ListCursosByGradoSedeUseCase,
  UpdateCursoUseCase,
} from 'src/application/use-case/cursos/cursos.usecases';
import { PrismaCursoRepository } from 'src/infrastructure/repositories/prisma-curso.repository';
import { CursoController } from 'src/interfaces/controllers/curso.controller';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [CursoController],
  providers: [
    PrismaCursoRepository,
    CreateCursoUseCase,
    ListCursosByGradoSedeUseCase,
    UpdateCursoUseCase,
    DeleteCursoUseCase,
  ],
  exports: [],
})
export class CursoModule {}
