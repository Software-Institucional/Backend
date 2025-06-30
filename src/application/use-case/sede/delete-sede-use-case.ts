import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SedeRepository } from 'src/domain/repositories/sede/sede.repository';

@Injectable()
export class DeleteSedeUseCase {
  constructor(
    @Inject('SedeRepository') private readonly sedeRepository: SedeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const sede = await this.sedeRepository.findById(id);
    if (!sede) throw new NotFoundException('Sede no encontrada');
    await this.sedeRepository.deleteSede(id);
  }
}
