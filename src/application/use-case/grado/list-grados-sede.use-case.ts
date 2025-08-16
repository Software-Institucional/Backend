import { Inject, Injectable } from '@nestjs/common';
import { GradoSedeResponseDto } from 'src/application/dtos/grado-sede';
import { GradoSedeRepository } from 'src/domain/repositories/grado-sede.repository';

@Injectable()
export class ListGradosSedeNivelUseCase {
  constructor(
    @Inject('GradoSedeRepository') private readonly repo: GradoSedeRepository,
  ) {}

  async execute(
    sedeId: string,
    nivelId: string,
  ): Promise<GradoSedeResponseDto[]> {
    const grados = await this.repo.list(sedeId, nivelId);
    return grados.map((g) => ({ ...g }));
  }
}
