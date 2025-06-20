import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { SchoolRepository } from 'src/domain/repositories/school/scholl.repository';
import { School } from 'src/domain/entities/school/school.entity';

@Injectable()
export class PrismaSchoolRepository implements SchoolRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSchool(school: School): Promise<School> {
    const savedSchool = await this.prisma.school.create({
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
      },
    });

    return new School(
      savedSchool.id,
      savedSchool.name,
      savedSchool.address ?? undefined,
      savedSchool.phone ?? undefined,
      savedSchool.imgUrl ?? undefined,
      savedSchool.department ?? undefined,
      savedSchool.municipality ?? undefined,
      savedSchool.mail ?? undefined,
      savedSchool.website ?? undefined,
      savedSchool.createdAt,
      savedSchool.updatedAt,
    );
  }

  async searchSchools(name: string, page = 1, limit = 10): Promise<School[]> {
    const schools = await this.prisma.school.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
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
  async updateSchool(school: School, id: string): Promise<School> {
    const updatedSchool = await this.prisma.school.update({
      where: {
        id: id,
      },
      data: {
        name: school.name,
        address: school.address,
        phone: school.phone,
        imgUrl: school.imgUrl,
        department: school.department,
        municipality: school.municipality,
        mail: school.mail,
        website: school.website,
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

  async findById(id: string): Promise<School | null> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) return null;
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
}
