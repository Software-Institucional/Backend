import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { SchoolRepository } from 'src/domain/repositories/scholl.repository';
import { School } from 'src/domain/entities/school/school.entity';

@Injectable()
export class PrismaSchoolRepository implements SchoolRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSchool(school: School): Promise<School> {
    const createdSchool = await this.prisma.school.create({
      data: {
        id: school.id,
        name: school.name,
        codeDANE: school.codeDANE,
        address: school.address,
        phone: school.phone,
        imgUrl: school.imgUrl,
        department: school.department,
        municipality: school.municipality,
        mail: school.mail,
        website: school.website,
        activate: school.activate,
        createdAt: school.createdAt,
        updatedAt: school.updatedAt,
      },
    });
    return new School(
      createdSchool.id,
      createdSchool.name,
      createdSchool.codeDANE ?? undefined,
      createdSchool.address ?? undefined,
      createdSchool.phone ?? undefined,
      createdSchool.imgUrl ?? undefined,
      createdSchool.department ?? undefined,
      createdSchool.municipality ?? undefined,
      createdSchool.mail ?? undefined,
      createdSchool.website ?? undefined,
      Boolean(createdSchool.activate),
      createdSchool.createdAt,
      createdSchool.updatedAt,
    );
  }

  async findById(id: string): Promise<School | null> {
    const school = await this.prisma.school.findUnique({
      where: { id },
      include: {
        sedes: true,
      },
    });
    if (!school) {
      return null;
    }
    const schoolEntity = new School(
      school.id,
      school.name,
      school.codeDANE ?? undefined,
      school.address ?? undefined,
      school.phone ?? undefined,
      school.imgUrl ?? undefined,
      school.department ?? undefined,
      school.municipality ?? undefined,
      school.mail ?? undefined,
      school.website ?? undefined,
      Boolean(school.activate),
      school.createdAt,
      school.updatedAt,
    );
    schoolEntity.sedes = school.sedes.map((sede) => ({
      id: sede.id,
      name: sede.name,
      codeDANE: sede.codeDANE ?? undefined,
      address: sede.address ?? undefined,
      phone: sede.phone ?? undefined,
      createdAt: sede.createdAt,
      updatedAt: sede.updatedAt,
    }));
    return schoolEntity;
  }

  async searchSchoolsWithCount(
    name?: string,
    page = 1,
    limit = 10,
  ): Promise<{ schools: School[]; total: number }> {
    const whereCondition = name
      ? {
          name: {
            contains: name,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const [schools, total] = await Promise.all([
      this.prisma.school.findMany({
        where: whereCondition,
        include: {
          sedes: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.school.count({
        where: whereCondition,
      }),
    ]);

    return {
      schools: schools.map((s) => {
        const schoolEntity = new School(
          s.id,
          s.name,
          s.codeDANE ?? undefined,
          s.address ?? undefined,
          s.phone ?? undefined,
          s.imgUrl ?? undefined,
          s.department ?? undefined,
          s.municipality ?? undefined,
          s.mail ?? undefined,
          s.website ?? undefined,
          Boolean(s.activate),
          s.createdAt,
          s.updatedAt,
        );
        schoolEntity.sedes = s.sedes.map((sede) => ({
          id: sede.id,
          name: sede.name,
          codeDANE: sede.codeDANE ?? undefined,
          address: sede.address ?? undefined,
          phone: sede.phone ?? undefined,
          createdAt: sede.createdAt,
          updatedAt: sede.updatedAt,
        }));
        return schoolEntity;
      }),
      total,
    };
  }

  async updateSchool(school: School): Promise<School> {
    const updatedSchool = await this.prisma.school.update({
      where: { id: school.id },
      data: {
        name: school.name,
        address: school.address,
        phone: school.phone,
        imgUrl: school.imgUrl,
        department: school.department,
        municipality: school.municipality,
        mail: school.mail,
        website: school.website,
        activate: school.activate,
        updatedAt: new Date(),
      },
    });
    return new School(
      updatedSchool.id,
      updatedSchool.name,
      updatedSchool.codeDANE ?? undefined,
      updatedSchool.address ?? undefined,
      updatedSchool.phone ?? undefined,
      updatedSchool.imgUrl ?? undefined,
      updatedSchool.department ?? undefined,
      updatedSchool.municipality ?? undefined,
      updatedSchool.mail ?? undefined,
      updatedSchool.website ?? undefined,
      Boolean(updatedSchool.activate),
      updatedSchool.createdAt,
      updatedSchool.updatedAt,
    );
  }
}
