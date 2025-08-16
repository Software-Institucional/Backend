import { Injectable } from '@nestjs/common';
import { UpdateSedeDto } from 'src/application/dtos/sedes.dtos';
import { Sede } from 'src/domain/entities/sede/sede.entity';
import { SedeRepository } from 'src/domain/repositories/sede.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaSedeRepository implements SedeRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Crear sede, sus niveles asociados y copia de grados globales a la sede
  async createSede(sede: Sede): Promise<Sede> {
    // 1. Crea la sede
    const created = await this.prisma.sede.create({
      data: {
        id: sede.id,
        name: sede.name,
        codeDANE: sede.codeDANE,
        address: sede.address,
        phone: sede.phone,
        schoolId: sede.schoolId,
        active: sede.active,
        Zone: sede.Zone,
        calendar: sede.calendar,
      },
    });

    // 2. Crea las relaciones SedeNivel y copia grados
    if (sede.niveles && sede.niveles.length > 0) {
      await Promise.all(
        sede.niveles.map(async (nivelId: string | { id: string }) => {
          const nivelIdValue =
            typeof nivelId === 'string' ? nivelId : nivelId.id;

          // a) Crea SedeNivel
          await this.prisma.sedeNivel.create({
            data: {
              sedeId: created.id,
              nivelId: nivelIdValue,
            },
          });

          // b) Busca los grados globales de ese nivel
          const gradosGlobales = await this.prisma.grado.findMany({
            where: { nivelId: nivelIdValue },
          });

          // c) Crea GradoSede para cada grado global
          await Promise.all(
            gradosGlobales.map((grado) =>
              this.prisma.gradoSede.create({
                data: {
                  name: grado.name,
                  sedeId: created.id,
                  nivelId: nivelIdValue,
                  gradoId: grado.id,
                  activo: true,
                  custom: false,
                },
              }),
            ),
          );
        }),
      );
    }

    // 3. Retorna la entidad Sede con niveles asignados
    return new Sede(
      created.id,
      created.name,
      created.schoolId,
      created.calendar,
      created.Zone,
      created.active,
      created.address ?? undefined,
      created.phone ?? undefined,
      created.codeDANE ?? undefined,
      created.createdAt,
      created.updatedAt,
    );
  }

  // Buscar una sede por ID, incluyendo sus niveles
  async findById(id: string): Promise<Sede | null> {
    const found = await this.prisma.sede.findUnique({
      where: { id },
      include: {
        school: true,
        gradoSede: true,
        users: true,
        SedeNivel: { include: { nivel: true } },
      },
    });

    if (!found) return null;

    const niveles = found.SedeNivel.map((sn) => ({
      id: sn.nivel.id,
      name: sn.nivel.name,
    }));

    return new Sede(
      found.id,
      found.name,
      found.schoolId,
      found.calendar,
      found.Zone,
      found.active,
      found.address ?? undefined,
      found.phone ?? undefined,
      found.codeDANE ?? undefined,
      found.createdAt,
      found.updatedAt,
      found.school,
      niveles,
    );
  }

  // Listar todas las sedes, con sus niveles asociados
  async findAll(): Promise<Sede[]> {
    const sedes = await this.prisma.sede.findMany({
      include: {
        school: true,
        gradoSede: true,
        users: true,
        SedeNivel: { include: { nivel: true } },
      },
    });

    return sedes.map(
      (s) =>
        new Sede(
          s.id,
          s.name,
          s.schoolId,
          s.calendar,
          s.Zone,
          s.active,
          s.address ?? undefined,
          s.phone ?? undefined,
          s.codeDANE ?? undefined,
          s.createdAt,
          s.updatedAt,
          s.school,
          s.SedeNivel.map((sn) => ({
            id: sn.nivel.id,
            name: sn.nivel.name,
          })),
        ),
    );
  }

  // Buscar sedes por colegio, con sus niveles asociados
  async findBySchoolId(schoolId: string): Promise<Sede[]> {
    const sedes = await this.prisma.sede.findMany({
      where: { schoolId },
      include: { SedeNivel: { include: { nivel: true } } },
    });

    return sedes.map(
      (s) =>
        new Sede(
          s.id,
          s.name,
          s.schoolId,
          s.calendar,
          s.Zone,
          s.active,
          s.address ?? undefined,
          s.phone ?? undefined,
          s.codeDANE ?? undefined,
          s.createdAt,
          s.updatedAt,
          undefined,
          s.SedeNivel.map((sn) => ({
            id: sn.nivel.id,
            name: sn.nivel.name,
          })),
        ),
    );
  }

  // Eliminar sede
  async deleteSede(id: string): Promise<void> {
    await this.prisma.sede.delete({ where: { id } });
  }

  // Actualizar sede y niveles asociados (opcional: no duplica grados)
  async update(id: string, data: UpdateSedeDto): Promise<Sede> {
    const { niveles, ...sedeData } = data;

    // Actualiza la sede
    const updated = await this.prisma.sede.update({
      where: { id },
      data: sedeData,
    });

    // Si actualizan los niveles, primero borra y luego inserta los nuevos
    if (niveles && niveles.length > 0) {
      await this.prisma.sedeNivel.deleteMany({ where: { sedeId: id } });
      await Promise.all(
        niveles.map((nivelId: string) =>
          this.prisma.sedeNivel.create({
            data: {
              sedeId: id,
              nivelId,
            },
          }),
        ),
      );
      // Si quieres duplicar también grados globales por cada nivel nuevo, aquí debes agregar la lógica igual que arriba
    }

    // Después de actualizar la sede y los niveles...
    let nivelesData: { id: string; name: string }[] = [];
    if (niveles && niveles.length > 0) {
      nivelesData = await this.prisma.nivel.findMany({
        where: { id: { in: niveles } },
        select: { id: true, name: true },
      });
    }

    return new Sede(
      updated.id,
      updated.name,
      updated.schoolId,
      updated.calendar,
      updated.Zone,
      updated.active,
      updated.address ?? undefined,
      updated.phone ?? undefined,
      updated.codeDANE ?? undefined,
      updated.createdAt,
      updated.updatedAt,
      undefined,
      nivelesData,
    );
  }
}
