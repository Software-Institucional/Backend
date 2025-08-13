// src/application/use-case/grado-sede/init-grados-sede-nivel.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { GradoSedeResponseDto } from 'src/application/dtos/grado-sede';
import { GradoSedeRepository } from 'src/domain/repositories/grado-sede.repository';

@Injectable()
export class InitGradosSedeNivelUseCase {
  constructor(
    @Inject('GradoSedeRepository') private readonly repo: GradoSedeRepository,
  ) {}

  async execute(
    sedeId: string,
    nivelId: string,
  ): Promise<GradoSedeResponseDto[]> {
    const result = await this.repo.initGradosSedeNivel(sedeId, nivelId);
    return result.map((g) => ({ ...g }));
  }
}
