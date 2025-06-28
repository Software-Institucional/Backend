import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import {
  AllUserRequestDto,
  AllUserResponseDto,
  AllUsersBySchoolResponseDto,
} from 'src/application/dtos/user.dtos';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';
import { UserRepository } from 'src/domain/repositories/auth/user.repository';

@Injectable()
export class AllUSerUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async allUser(
    request: { user: JwtPayload } & AllUserRequestDto,
  ): Promise<AllUserResponseDto | AllUsersBySchoolResponseDto> {
    const userId = request.user.sub;

    if (!userId) {
      throw new Error('User not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPER') {
      throw new UnauthorizedException(
        'No tienes permiso para acceder a este recurso.',
      );
    }

    // Convertir page y limit a números (opcionales)
    const page = request.page ? parseInt(request.page.toString(), 10) : 1;
    const limit = request.limit ? parseInt(request.limit.toString(), 10) : 10;
    const { search, role, schoolId } = request;

    // Validar que schoolId esté presente
    if (!schoolId) {
      throw new BadRequestException('El parámetro schoolId es obligatorio.');
    }

    // Lógica de visibilidad y búsqueda
    let createdById: string | undefined = undefined;
    if (user.role === 'ADMIN') {
      createdById = user.id;
    }

    const { users, total } = await this.userRepository.searchUsersWithFilters(
      search,
      role,
      schoolId,
      page,
      limit,
      createdById,
    );

    const totalPages = Math.ceil(total / limit);
    const totalUsers = total;
    const docentes = users.filter((u) => u.role === 'DOCENTE').length;
    const activos = users.filter((u) => u.activate).length;
    const cantidadSedes = new Set(
      users.filter((u) => u.sede && u.sede.id).map((u) => u.sede?.id),
    ).size;

    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        isEmailVerified: u.isEmailVerified,
        activate: u.activate,
        sedes:
          u.sede && u.sede.id
            ? {
                id: u.sede.id,
                name: u.sede.name,
                address: u.sede.address,
                phone: u.sede.phone,
                createdAt: u.sede.createdAt,
                updatedAt: u.sede.updatedAt,
              }
            : null,
      })),
      metadata: {
        total,
        page,
        limit,
        totalPages,
        totalUsers,
        docentes,
        activos,
        cantidadSedes,
      },
    };
  }
}
