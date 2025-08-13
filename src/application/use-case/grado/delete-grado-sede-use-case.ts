import { Inject, Injectable } from '@nestjs/common';
import { GradoSedeRepository } from 'src/domain/repositories/grado-sede.repository';

@Injectable()
export class DeleteGradoSedeUseCase {
  constructor(
    @Inject('GradoSedeRepository') private readonly repo: GradoSedeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    return this.repo.deleteIfPossible(id);
  }
}
