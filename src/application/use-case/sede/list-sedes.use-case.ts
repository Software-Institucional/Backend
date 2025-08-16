// src/application/use-case/sede/list-sedes.use-case.ts

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SedeResponseDto } from 'src/application/dtos/sedes.dtos';
import { PrismaSedeRepository } from 'src/infrastructure/repositories/prisma-sede.repository';

@Injectable()
export class ListSedesUseCase {
  constructor(
    @Inject('SedeRepository') private readonly sedeRepo: PrismaSedeRepository,
  ) {}

  async execute(): Promise<SedeResponseDto[]> {
    return this.sedeRepo.findAll();
  }

  async getexecute(id: string): Promise<SedeResponseDto> {
    const sede = await this.sedeRepo.findById(id);
    if (!sede) throw new NotFoundException('Sede no encontrada');
    return sede;
  }
}
