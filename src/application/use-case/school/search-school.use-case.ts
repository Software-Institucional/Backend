import { Inject } from '@nestjs/common';
import {
  SearchSchoolRequestDto,
  SearchSchoolResponseDto,
} from 'src/application/dtos/school.dtos';
import { SchoolRepository } from 'src/domain/repositories/school/scholl.repository';

export class SearchSchoolUseCase {
  constructor(
    @Inject('SchoolRepository')
    private readonly schoolRepository: SchoolRepository,
  ) {}

  async Search(req: SearchSchoolRequestDto): Promise<SearchSchoolResponseDto> {
    const { schools, total } =
      await this.schoolRepository.searchSchoolsWithCount(
        req.name,
        req.page,
        req.limit,
      );

    const page = req.page || 1;
    const limit = req.limit || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      schools: schools.map((s) => ({
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
          sedes:
            s.sedes?.map((sede) => ({
              id: sede.id,
              name: sede.name,
              address: sede.address,
              phone: sede.phone,
              createdAt: sede.createdAt,
              updatedAt: sede.updatedAt,
            })) || [],
        },
      })),
      metadata: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}
