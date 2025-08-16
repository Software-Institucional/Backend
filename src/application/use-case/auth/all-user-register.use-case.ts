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
  UserMetadataResponseDto,
} from 'src/application/dtos/user.dtos';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';
import { UserRepository } from 'src/domain/repositories/user.repository';

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

    const page =
      request.page !== undefined && request.page !== null
        ? parseInt(request.page.toString(), 10)
        : 1;

    const limit =
      request.limit !== undefined && request.limit !== null
        ? parseInt(request.limit.toString(), 10)
        : 10;

    const search = request.search || undefined;
    const role = request.role || undefined;

    // ✅ Aquí está la corrección del error: usamos `let`, no `const`
    let activate: boolean | undefined = undefined;
    if (typeof request.activate === 'boolean') {
      activate = request.activate;
    } else if (request.activate === 'true' || request.activate === 'false') {
      activate = request.activate === 'true';
    }

    let isEmailVerified: boolean | undefined = undefined;
    if (typeof request.isEmailVerified === 'boolean') {
      isEmailVerified = request.isEmailVerified;
    } else if (
      request.isEmailVerified === 'true' ||
      request.isEmailVerified === 'false'
    ) {
      isEmailVerified = request.isEmailVerified === 'true';
    }

    const schoolId = request.schoolId;
    if (!schoolId) {
      throw new BadRequestException('El parámetro schoolId es obligatorio.');
    }

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
      activate,
      isEmailVerified,
    );

    const totalPages = Math.ceil(total / limit);

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
      },
    };
  }

  async getUserMetadata(
    request: { user: JwtPayload } & AllUserRequestDto,
  ): Promise<UserMetadataResponseDto> {
    const userId = request.user.sub;
    if (!userId) throw new Error('User not found');
    const user = await this.userRepository.findById(userId);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    if (user.role !== 'ADMIN' && user.role !== 'SUPER') {
      throw new UnauthorizedException(
        'No tienes permiso para acceder a este recurso.',
      );
    }

    let activate: boolean | undefined = undefined;
    if (typeof request.activate === 'boolean') activate = request.activate;
    else if (request.activate === 'true' || request.activate === 'false')
      activate = request.activate === 'true';

    let isEmailVerified: boolean | undefined = undefined;
    if (typeof request.isEmailVerified === 'boolean')
      isEmailVerified = request.isEmailVerified;
    else if (
      request.isEmailVerified === 'true' ||
      request.isEmailVerified === 'false'
    )
      isEmailVerified = request.isEmailVerified === 'true';

    const schoolId = request.schoolId;
    if (!schoolId)
      throw new BadRequestException('El parámetro schoolId es obligatorio.');

    let createdById: string | undefined = undefined;
    if (user.role === 'ADMIN') createdById = user.id;

    // Traer todos los usuarios (sin paginación)
    const { users } = await this.userRepository.searchUsersWithFilters(
      request.search,
      request.role,
      schoolId,
      1,
      10000, // max results para evitar paginación
      createdById,
      activate,
      isEmailVerified,
    );

    // Calcular metadata
    const total = users.length;
    const totalUsers = total;
    const docentes = users.filter((u) => u.role === 'DOCENTE').length;
    const activos = users.filter((u) => u.activate).length;
    const cantidadSedes = new Set(
      users.filter((u) => u.sede && u.sede.id).map((u) => u.sede?.id),
    ).size;

    return {
      total,
      totalUsers,
      docentes,
      activos,
      cantidadSedes,
    };
  }
}
