import { School } from 'src/domain/entities/school/school.entity';

export interface SchoolRepository {
  createSchool(school: School): Promise<School>;
  searchSchoolsWithCount(
    name?: string,
    page?: number,
    limit?: number,
  ): Promise<{ schools: School[]; total: number }>;
  updateSchool(school: School, id: string): Promise<School>;
  findById(id: string): Promise<School | null>;
}
