import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaSedeRepository } from 'src/infrastructure/repositories/prisma-sede.repository';

@Injectable()
export class DeleteSedeUseCase {
  constructor(
    @Inject('SedeRepository') private readonly sedeRepo: PrismaSedeRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.sedeRepo.findById(id);
    if (!exists) throw new NotFoundException('Sede no encontrada');
    await this.sedeRepo.deleteSede(id);
  }
}
