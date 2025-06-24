import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AllUserResponseDto } from 'src/application/dtos/user.dtos';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';
import { UserRepository } from 'src/domain/repositories/auth/user.repository';

@Injectable()
export class AllUSerUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async allUser(request: { user: JwtPayload }): Promise<AllUserResponseDto> {
    const userId = request.user.sub;

    if (!userId) {
      throw new Error('User not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.role !== 'SUPER' && user.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'No tienes permiso registrar y ver usuarios',
      );
    }

    const users = await this.userRepository.allUser(user.id);

    return {
      users,
    };
  }
}
