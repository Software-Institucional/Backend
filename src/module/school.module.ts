import { Module } from '@nestjs/common';
import { CreateSchoolUseCase } from 'src/application/use-case/school/create-school.use-case';
import { SearchSchoolUseCase } from 'src/application/use-case/school/search-school.use-case';
import { UpdateSchoolUseCase } from 'src/application/use-case/school/update-school.use-case';
import { SchoolController } from 'src/interfaces/controllers/school.controller';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [SchoolController],
  providers: [CreateSchoolUseCase, SearchSchoolUseCase, UpdateSchoolUseCase],
})
export class SchoolModule {}
