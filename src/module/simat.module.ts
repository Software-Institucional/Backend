import { Module } from '@nestjs/common';
import { SimatController } from 'src/interfaces/controllers/simat.controller';
import { CoreModule } from './core/core.module';
import { ConsultarFichaAlumnoUseCase } from 'src/application/use-case/student/consultar-ficha-alumno.use-case';
import { SimatService } from 'src/infrastructure/services/get-students-simat.service';

@Module({
  imports: [CoreModule],
  controllers: [SimatController],
  providers: [SimatService, ConsultarFichaAlumnoUseCase],
})
export class SimatModule {}
