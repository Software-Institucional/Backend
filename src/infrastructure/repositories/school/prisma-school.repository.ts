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
      savedSchool.address || undefined,
      savedSchool.phone || undefined,
      savedSchool.imgUrl || undefined,
      savedSchool.department || undefined,
      savedSchool.municipality || undefined,
      savedSchool.mail || undefined,
      savedSchool.website || undefined,
      savedSchool.createdAt,
      savedSchool.updatedAt,
    );
  }
}
