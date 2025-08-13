// src/application/use-case/sede/update-sede.use-case.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SedeResponseDto,
  UpdateSedeDto,
} from 'src/application/dtos/sedes.dtos';
import { PrismaSedeRepository } from 'src/infrastructure/repositories/prisma-sede.repository';

@Injectable()
export class UpdateSedeUseCase {
  constructor(
    @Inject('SedeRepository') private readonly sedeRepo: PrismaSedeRepository,
  ) {}

  async execute(id: string, dto: UpdateSedeDto): Promise<SedeResponseDto> {
    const exists = await this.sedeRepo.findById(id);
    if (!exists) throw new NotFoundException('Sede no encontrada');
    return this.sedeRepo.update(id, dto);
  }
}
