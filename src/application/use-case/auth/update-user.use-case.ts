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
import { UserRepository } from 'src/domain/repositories/auth/user.repository';
import { SchoolRepository } from 'src/domain/repositories/school/scholl.repository';
import { SedeRepository } from 'src/domain/repositories/sede/sede.repository';
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
      schools,
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
    this.validatePermissions(
      currentUserEntity,
      userToUpdate,
      role,
      schools,
      activate,
    );

    // Validar colegios y sedes si se van a actualizar
    if (schools && schools.length > 0) {
      await this.validateSchoolsAndSedes(schools);
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
    const savedUser = await this.userRepository.update(updatedUser, schools);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        isEmailVerified: savedUser.isEmailVerified,
        activate: savedUser.activate,
        schools: savedUser.schools?.map((school) => ({
          id: school.id,
          name: school.name,
          address: school.address || undefined,
          phone: school.phone || undefined,
          imgUrl: school.imgUrl || undefined,
          department: school.department || undefined,
          municipality: school.municipality || undefined,
          mail: school.mail || undefined,
          website: school.website || undefined,
          createdAt: school.createdAt,
          updatedAt: school.updatedAt,
          sedes:
            school.sedes?.map((sede) => ({
              id: sede.id,
              name: sede.name,
              address: sede.address || undefined,
              phone: sede.phone || undefined,
              createdAt: sede.createdAt,
              updatedAt: sede.updatedAt,
            })) || [],
        })),
        message: 'Usuario actualizado exitosamente',
      },
    };
  }

  private validatePermissions(
    currentUser: User,
    userToUpdate: User,
    newRole?: string,
    schools?: { schoolId: string; sedeIds?: string[] }[],
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

      // USER no puede modificar colegios/sedes
      if (schools) {
        throw new UnauthorizedException('No puedes modificar colegios y sedes');
      }

      // USER no puede cambiar su estado de activación
      if (activate !== undefined && activate !== currentUser.activate) {
        throw new UnauthorizedException(
          'No puedes cambiar tu estado de activación',
        );
      }
    }
  }

  private async validateSchoolsAndSedes(
    schools: { schoolId: string; sedeIds?: string[] }[],
  ): Promise<void> {
    for (const school of schools) {
      const schoolExists = await this.schoolRepository.findById(
        school.schoolId,
      );
      if (!schoolExists) {
        throw new BadRequestException(
          `El colegio ${school.schoolId} no existe.`,
        );
      }

      if (school.sedeIds && school.sedeIds.length > 0) {
        for (const sedeId of school.sedeIds) {
          const sede = await this.sedeRepository.findById(sedeId);
          if (!sede || sede.schoolId !== school.schoolId) {
            throw new BadRequestException(
              `La sede ${sedeId} no pertenece al colegio ${school.schoolId}.`,
            );
          }
        }
      }
    }
  }
}
