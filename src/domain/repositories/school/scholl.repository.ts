import { School } from 'src/domain/entities/school/school.entity';

export interface SchoolRepository {
  createSchool(school: School): Promise<School>;
}
