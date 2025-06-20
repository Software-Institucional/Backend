import { Inject } from '@nestjs/common';
import {
  CreateSchoolResponseDto,
  SearchSchoolRequestDto,
} from 'src/application/dtos/school.dtos';
import { SchoolRepository } from 'src/domain/repositories/school/scholl.repository';

export class SearchSchoolUseCase {
  constructor(
    @Inject('SchoolRepository')
    private readonly schoolRepository: SchoolRepository,
  ) {}

  async Search(
    req: SearchSchoolRequestDto,
  ): Promise<CreateSchoolResponseDto[]> {
    const schools = await this.schoolRepository.searchSchools(
      req.name,
      req.page,
      req.limit,
    );

    return schools.map((s) => ({
      school: {
        id: s.id,
        name: s.name,
        address: s.address ?? '',
        phone: s.phone ?? '',
        imgUrl: s.imgUrl ?? '',
        department: s.department ?? '',
        municipality: s.municipality ?? '',
        mail: s.mail ?? '',
        website: s.website ?? '',
      },
    }));
  }
}
