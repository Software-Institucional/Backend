import { GradoSede } from '@prisma/client';

export interface GradoSedeRepository {
  // Inicializa con los grados globales (copia los grados globales del nivel)
  initGradosSedeNivel(sedeId: string, nivelId: string): Promise<GradoSede[]>;
  // Crea grado personalizado
  createCustom(
    sedeId: string,
    nivelId: string,
    name: string,
  ): Promise<GradoSede>;
  // Listar todos los grados por sede/nivel
  list(sedeId: string, nivelId: string): Promise<GradoSede[]>;
  // Cambiar estado activo
  setActivo(
    id: string,
    dto: { name?: string; activo?: boolean },
  ): Promise<GradoSede>;
  // Eliminar si es posible
  deleteIfPossible(id: string): Promise<void>;
}
