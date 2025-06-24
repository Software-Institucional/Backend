import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Sede } from 'src/domain/entities/sede/sede.entity';
import { SedeRepository } from 'src/domain/repositories/sede/sede.repository';

@Injectable()
export class CreateSedeUseCase {
  constructor(
    @Inject('SedeRepository') private readonly sedeRepository: SedeRepository,
  ) {}

  async execute(input: {
    name: string;
    address?: string;
    phone?: string;
    schoolId: string;
  }): Promise<Sede> {
    const sede = new Sede(
      randomUUID(),
      input.name,
      input.schoolId,
      input.address,
      input.phone,
      new Date(),
      new Date(),
    );
    return await this.sedeRepository.createSede(sede);
  }
}
