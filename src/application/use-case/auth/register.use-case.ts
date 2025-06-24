import {
  Inject,
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  RegisterRequestDto,
  RegisterResponseDto,
} from 'src/application/dtos/user.dtos';
import { User } from 'src/domain/entities/auth/user.entity';
import { UserRepository } from 'src/domain/repositories/auth/user.repository';
import { SchoolRepository } from 'src/domain/repositories/school/scholl.repository';
import { SedeRepository } from 'src/domain/repositories/sede/sede.repository';
import { PasswordService } from 'src/domain/services/password.service';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('SedeRepository')
    private readonly sedeRepository: SedeRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('PasswordService')
    private readonly passwordService: PasswordService,
    @Inject('SchoolRepository')
    private readonly schoolRepository: SchoolRepository,
  ) {}

  async execute(request: RegisterRequestDto): Promise<RegisterResponseDto> {
    const { email, role, firstName, lastName, schools } = request;

    // Validar usuario existente
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    // Validar colegios y sedes
    if (schools && schools.length > 0) {
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
            if (!sede || sede.school?.id !== school.schoolId) {
              throw new BadRequestException(
                `La sede ${sedeId} no pertenece al colegio ${school.schoolId}.`,
              );
            }
          }
        }
      }
    } else if (role !== 'SUPER') {
      throw new BadRequestException(
        'Se requiere al menos un colegio para este rol.',
      );
    }

    // Crear usuario
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await this.passwordService.hash(tempPassword);
    const user = User.create(email, hashedPassword, firstName, lastName, role);

    // Guardar usuario y relaciones
    const savedUser = await this.userRepository.save(user, schools);

    // TODO: Send verification email with temp password
    console.log(`Temp password for ${email}: ${tempPassword}`);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        message:
          'Usuario registrado exitosamente. Por favor revisa tu correo para la verificación.',
      },
    };
  }
}
