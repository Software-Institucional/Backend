import { Inject, Injectable } from '@nestjs/common';
import { GradoSedeResponseDto } from 'src/application/dtos/grado-sede';
import { GradoSedeRepository } from 'src/domain/repositories/grado-sede.repository';

@Injectable()
export class SetActivoGradoSedeUseCase {
  constructor(
    @Inject('GradoSedeRepository') private readonly repo: GradoSedeRepository,
  ) {}

  async execute(
    id: string,
    dto: { name?: string; activo?: boolean },
  ): Promise<GradoSedeResponseDto> {
    const g = await this.repo.setActivo(id, dto);
    return { ...g };
  }
}
