import { Injectable } from '@nestjs/common';
import { Curso } from 'src/domain/entities/cursos/curso.entity';
import { CursoRepository } from 'src/domain/repositories/curso.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaCursoRepository implements CursoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCurso(
    gradoSedeId: string,
    name: string,
    codeOfficial: number,
  ): Promise<Curso> {
    const created = await this.prisma.salones.create({
      data: {
        name,
        codeOfficial,
        gradoSedeId,
      },
    });
    return new Curso(
      created.id,
      created.name,
      created.codeOfficial,
      created.gradoSedeId,
      created.activo,
    );
  }

  async findByGradoSede(gradoSedeId: string): Promise<Curso[]> {
    const cursos = await this.prisma.salones.findMany({
      where: { gradoSedeId },
    });
    return cursos.map(
      (c) => new Curso(c.id, c.name, c.codeOfficial, c.gradoSedeId, c.activo),
    );
  }

  async updateCurso(
    id: string,
    data: { nombre?: string; activo?: boolean },
  ): Promise<Curso> {
    const updated = await this.prisma.salones.update({
      where: { id },
      data,
    });
    return new Curso(
      updated.id,
      updated.name,
      updated.codeOfficial,
      updated.gradoSedeId,
      updated.activo,
    );
  }

  async deleteCurso(id: string): Promise<void> {
    await this.prisma.salones.delete({ where: { id } });
  }
}
