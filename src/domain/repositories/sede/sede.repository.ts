import { Sede } from 'src/domain/entities/sede/sede.entity';

export interface SedeRepository {
  createSede(sede: Sede): Promise<Sede>;
  findById(id: string): Promise<Sede | null>;
  findBySchoolId(schoolId: string): Promise<Sede[]>;
}
