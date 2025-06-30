import { Injectable } from '@nestjs/common';
import { Sede } from 'src/domain/entities/sede/sede.entity';
import { SedeRepository } from 'src/domain/repositories/sede/sede.repository';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaSedeRepository implements SedeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSede(sede: Sede): Promise<Sede> {
    const created = await this.prisma.sede.create({
      data: {
        id: sede.id,
        name: sede.name,
        address: sede.address,
        phone: sede.phone,
        schoolId: sede.schoolId,
      },
    });

    return new Sede(
      created.id,
      created.name,
      created.schoolId,
      created.address!,
      created.phone!,
      created.createdAt,
      created.updatedAt,
    );
  }

  async findById(id: string): Promise<Sede | null> {
    const found = await this.prisma.sede.findUnique({
      where: { id },
      include: { school: true },
    });
    return found
      ? new Sede(
          found.id,
          found.name,
          found.schoolId,
          found.address!,
          found.phone!,
          found.createdAt,
          found.updatedAt,
          found.school,
        )
      : null;
  }

  async findBySchoolId(schoolId: string): Promise<Sede[]> {
    const sedes = await this.prisma.sede.findMany({ where: { schoolId } });
    return sedes.map(
      (s) =>
        new Sede(
          s.id,
          s.name,
          s.address!,
          s.phone!,
          s.schoolId,
          s.createdAt,
          s.updatedAt,
        ),
    );
  }

  async deleteSede(id: string): Promise<void> {
    await this.prisma.sede.delete({ where: { id } });
  }
}
