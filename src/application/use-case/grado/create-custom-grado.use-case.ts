import { Inject, Injectable } from '@nestjs/common';
import { GradoSedeResponseDto } from 'src/application/dtos/grado-sede';
import { GradoSedeRepository } from 'src/domain/repositories/grado-sede.repository';

@Injectable()
export class CreateCustomGradoSedeUseCase {
  constructor(
    @Inject('GradoSedeRepository') private readonly repo: GradoSedeRepository,
  ) {}

  async execute(
    sedeId: string,
    nivelId: string,
    name: string,
  ): Promise<GradoSedeResponseDto> {
    const g = await this.repo.createCustom(sedeId, nivelId, name);
    return { ...g };
  }
}
