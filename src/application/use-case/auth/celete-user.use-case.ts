import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/auth/user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('SedeRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    await this.userRepository.delete(id);
  }
}
