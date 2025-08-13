// src/infrastructure/repositories/grado-sede/prisma-grado-sede.repository.ts

import { Injectable } from '@nestjs/common';
import { GradoSede } from '@prisma/client';
import { GradoSedeRepository } from 'src/domain/repositories/grado-sede.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaGradoSedeRepository implements GradoSedeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async initGradosSedeNivel(
    sedeId: string,
    nivelId: string,
  ): Promise<GradoSede[]> {
    const gradosGlobal = await this.prisma.grado.findMany({
      where: { nivelId },
    });
    const inserts = await Promise.all(
      gradosGlobal.map((g) =>
        this.prisma.gradoSede.create({
          data: {
            sedeId,
            nivelId,
            gradoId: g.id,
            name: g.name,
            custom: false,
          },
        }),
      ),
    );
    return inserts; // <-- ya es GradoSede[]
  }

  async createCustom(
    sedeId: string,
    nivelId: string,
    name: string,
  ): Promise<GradoSede> {
    const g = await this.prisma.gradoSede.create({
      data: {
        sedeId,
        nivelId,
        gradoId: null,
        name,
        custom: true,
      },
    });
    return g; // <-- retorna el objeto Prisma
  }

  async list(sedeId: string, nivelId: string): Promise<GradoSede[]> {
    const grados = await this.prisma.gradoSede.findMany({
      where: { sedeId, nivelId },
      orderBy: { name: 'asc' },
    });
    return grados; // <-- retorna el array Prisma
  }

  async setActivo(
    id: string,
    dto: { name?: string; activo?: boolean },
  ): Promise<GradoSede> {
    const g = await this.prisma.gradoSede.update({
      where: { id },
      data: {
        name: dto.name,
        activo: dto.activo,
      },
    });
    return g; // <-- retorna el objeto Prisma
  }

  async deleteIfPossible(id: string): Promise<void> {
    // Valida que no tenga cursos asociados (ni matrículas si las tienes)
    const countCursos = await this.prisma.salones.count({
      where: { gradoSedeId: id },
    });
    if (countCursos > 0)
      throw new Error('No se puede eliminar porque tiene cursos');
    await this.prisma.gradoSede.delete({ where: { id } });
  }
}
