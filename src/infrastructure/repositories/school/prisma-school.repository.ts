import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { SchoolRepository } from 'src/domain/repositories/school/scholl.repository';
import { School } from 'src/domain/entities/school/school.entity';

@Injectable()
export class PrismaSchoolRepository implements SchoolRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSchool(school: School): Promise<School> {
    const createdSchool = await this.prisma.school.create({
      data: {
        id: school.id,
        name: school.name,
        address: school.address,
        phone: school.phone,
        imgUrl: school.imgUrl,
        department: school.department,
        municipality: school.municipality,
        mail: school.mail,
        website: school.website,
        createdAt: school.createdAt,
        updatedAt: school.updatedAt,
      },
    });
    return new School(
      createdSchool.id,
      createdSchool.name,
      createdSchool.address ?? undefined,
      createdSchool.phone ?? undefined,
      createdSchool.imgUrl ?? undefined,
      createdSchool.department ?? undefined,
      createdSchool.municipality ?? undefined,
      createdSchool.mail ?? undefined,
      createdSchool.website ?? undefined,
      createdSchool.createdAt,
      createdSchool.updatedAt,
    );
  }

  async findById(id: string): Promise<School | null> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) {
      return null;
    }
    return new School(
      school.id,
      school.name,
      school.address ?? undefined,
      school.phone ?? undefined,
      school.imgUrl ?? undefined,
      school.department ?? undefined,
      school.municipality ?? undefined,
      school.mail ?? undefined,
      school.website ?? undefined,
      school.createdAt,
      school.updatedAt,
    );
  }

  async searchSchools(name?: string, page = 1, limit = 10): Promise<School[]> {
    const whereCondition = name
      ? {
          name: {
            contains: name,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const schools = await this.prisma.school.findMany({
      where: whereCondition,
      skip: (page - 1) * limit,
      take: limit,
    });

    return schools.map(
      (s) =>
        new School(
          s.id,
          s.name,
          s.address ?? undefined,
          s.phone ?? undefined,
          s.imgUrl ?? undefined,
          s.department ?? undefined,
          s.municipality ?? undefined,
          s.mail ?? undefined,
          s.website ?? undefined,
          s.createdAt,
          s.updatedAt,
        ),
    );
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
        updatedAt: new Date(),
      },
    });
    return new School(
      updatedSchool.id,
      updatedSchool.name,
      updatedSchool.address ?? undefined,
      updatedSchool.phone ?? undefined,
      updatedSchool.imgUrl ?? undefined,
      updatedSchool.department ?? undefined,
      updatedSchool.municipality ?? undefined,
      updatedSchool.mail ?? undefined,
      updatedSchool.website ?? undefined,
      updatedSchool.createdAt,
      updatedSchool.updatedAt,
    );
  }
}
