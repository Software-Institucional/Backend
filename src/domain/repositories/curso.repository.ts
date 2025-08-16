import { Curso } from 'src/domain/entities/cursos/curso.entity';

export interface CursoRepository {
  createCurso(
    gradoSedeId: string,
    nombre: string,
    codeOfficial: number,
  ): Promise<Curso>;
  findByGradoSede(gradoSedeId: string): Promise<Curso[]>;
  updateCurso(
    id: string,
    data: { nombre?: string; activo?: boolean },
  ): Promise<Curso>;
  deleteCurso(id: string): Promise<void>;
}
