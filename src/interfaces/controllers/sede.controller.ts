import { Body, Controller, Post } from '@nestjs/common';
import { CreateSedeUseCase } from 'src/application/use-case/sede/create-sede.use-case';

@Controller('sedes')
export class SedeController {
  constructor(private readonly createSedeUseCase: CreateSedeUseCase) {}

  @Post()
  async create(
    @Body()
    dto: {
      name: string;
      address?: string;
      phone?: string;
      schoolId: string;
    },
  ) {
    return this.createSedeUseCase.execute(dto);
  }
}
