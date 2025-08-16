import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from 'src/application/dtos/user.dtos';
import { User } from 'src/domain/entities/auth/user.entity';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { SchoolRepository } from 'src/domain/repositories/scholl.repository';
import { SedeRepository } from 'src/domain/repositories/sede.repository';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';

interface UpdateUserUseCaseRequest extends UpdateUserRequestDto {
  user: JwtPayload;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('SchoolRepository')
    private readonly schoolRepository: SchoolRepository,
    @Inject('SedeRepository')
    private readonly sedeRepository: SedeRepository,
  ) {}

  async execute(
    request: UpdateUserUseCaseRequest,
  ): Promise<UpdateUserResponseDto> {
    const {
      id,
      user: currentUser,
      email,
      firstName,
      lastName,
      role,
      activate,
      schoolId,
      sedeId,
    } = request;

    // Verificar que el usuario actual existe
    const currentUserEntity = await this.userRepository.findById(
      currentUser.sub,
    );
    if (!currentUserEntity) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar que el usuario a actualizar existe
    const userToUpdate = await this.userRepository.findById(id);
    if (!userToUpdate) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar permisos
    this.validatePermissions(currentUserEntity, userToUpdate, role, activate);

    // Validar colegio y sede si se van a actualizar
    if (role !== 'SUPER') {
      if (!schoolId) {
        throw new BadRequestException(
          'Se requiere el id del colegio para este rol.',
        );
      }
      const schoolExists = await this.schoolRepository.findById(schoolId);
      if (!schoolExists) {
        throw new BadRequestException(`El colegio ${schoolId} no existe.`);
      }
      if (sedeId) {
        const sede = await this.sedeRepository.findById(sedeId);
        if (!sede || sede.schoolId !== schoolId) {
          throw new BadRequestException(
            `La sede ${sedeId} no pertenece al colegio ${schoolId}.`,
          );
        }
      }
    }

    // Crear usuario actualizado
    const updatedUser = new User(
      userToUpdate.id,
      email ?? userToUpdate.email,
      userToUpdate.password,
      firstName ?? userToUpdate.firstName,
      lastName ?? userToUpdate.lastName,
      role ?? userToUpdate.role,
      userToUpdate.isEmailVerified,
      userToUpdate.createdById,
      activate ?? userToUpdate.activate,
      userToUpdate.createdAt,
      new Date(),
    );

    // Guardar usuario actualizado
    const savedUser = await this.userRepository.update(
      updatedUser,
      schoolId,
      sedeId,
    );

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        isEmailVerified: savedUser.isEmailVerified,
        activate: savedUser.activate,
        school: savedUser.school
          ? {
              id: savedUser.school.id,
              name: savedUser.school.name,
              address: savedUser.school.address,
              phone: savedUser.school.phone,
              imgUrl: savedUser.school.imgUrl,
              department: savedUser.school.department,
              municipality: savedUser.school.municipality,
              mail: savedUser.school.mail,
              website: savedUser.school.website,
              createdAt: savedUser.school.createdAt,
              updatedAt: savedUser.school.updatedAt,
            }
          : null,
        sedes:
          savedUser.sede && savedUser.sede.id
            ? {
                id: savedUser.sede.id,
                name: savedUser.sede.name,
                address: savedUser.sede.address,
                phone: savedUser.sede.phone,
                createdAt: savedUser.sede.createdAt,
                updatedAt: savedUser.sede.updatedAt,
              }
            : null,
        message: 'Usuario actualizado exitosamente',
      },
    };
  }

  private validatePermissions(
    currentUser: User,
    userToUpdate: User,
    newRole?: string,
    activate?: boolean,
  ): void {
    // SUPER puede actualizar cualquier usuario
    if (currentUser.role === 'SUPER') {
      return;
    }

    // ADMIN puede actualizar usuarios que ha creado
    if (currentUser.role === 'ADMIN') {
      if (userToUpdate.createdById !== currentUser.id) {
        throw new UnauthorizedException(
          'Solo puedes actualizar usuarios que has creado',
        );
      }
      return;
    }

    // USER solo puede actualizarse a sí mismo
    if (currentUser.role === 'DOCENTE') {
      if (userToUpdate.id !== currentUser.id) {
        throw new UnauthorizedException(
          'Solo puedes actualizar tu propio perfil',
        );
      }

      // USER no puede cambiar su rol
      if (newRole && newRole !== currentUser.role) {
        throw new UnauthorizedException('No puedes cambiar tu rol');
      }

      // USER no puede cambiar su estado de activación
      if (activate !== undefined && activate !== currentUser.activate) {
        throw new UnauthorizedException(
          'No puedes cambiar tu estado de activación',
        );
      }
    }
  }
}
