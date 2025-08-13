import { Module } from '@nestjs/common';
import { CreateSedeUseCase } from 'src/application/use-case/sede/create-sede.use-case';
import { DeleteSedeUseCase } from 'src/application/use-case/sede/delete-sede-use-case';
import { SedeController } from 'src/interfaces/controllers/sede.controller';
import { CoreModule } from './core/core.module';
import { ListSedesUseCase } from 'src/application/use-case/sede/list-sedes.use-case';
import { UpdateSedeUseCase } from 'src/application/use-case/sede/update-sede.use-case';

@Module({
  imports: [CoreModule],
  controllers: [SedeController],
  providers: [
    CreateSedeUseCase,
    DeleteSedeUseCase,
    ListSedesUseCase,
    UpdateSedeUseCase,
  ],
})
export class SedeModule {}
