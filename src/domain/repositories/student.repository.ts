import {
  EstadoAlumnoSIMAT,
  FichaAlumno,
} from 'src/infrastructure/services/get-students-simat.service';

export interface StudentRepository {
  saveFichaAlumno(
    data: FichaAlumno,
  ): Promise<{ created: boolean; updated: boolean; id: string }>;
  saveMatriculaEstadoSimat(
    estado: EstadoAlumnoSIMAT,
    estudianteId: string,
  ): Promise<{ created: boolean; updated: boolean; id: string }>;
}
