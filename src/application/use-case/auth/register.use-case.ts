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
import { UserRepository } from 'src/domain/repositories/user.repository';
import { SchoolRepository } from 'src/domain/repositories/scholl.repository';
import { SedeRepository } from 'src/domain/repositories/sede.repository';
import { PasswordService } from 'src/domain/services/password.service';
import { EmailService } from 'src/domain/services/email.service';
import { PasswordResetRepository } from 'src/domain/repositories/password-reset.repository';
import { Role } from '@prisma/client';
import { PasswordReset } from 'src/domain/entities/auth/password-reset.entity';

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
    @Inject('EmailService')
    private readonly emailService: EmailService,
    @Inject('PasswordResetRepository')
    private readonly passwordResetRepository: PasswordResetRepository,
  ) {}

  async execute(request: RegisterRequestDto): Promise<RegisterResponseDto> {
    const { email, role, firstName, lastName, schoolId, sedeId, createdById } =
      request;

    // Validar rol
    if (!this.isValidRole(role)) {
      throw new BadRequestException(
        `Rol inválido. Los roles válidos son: ${Object.values(Role).join(', ')}`,
      );
    }

    // Validar usuario existente
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    // Validar usuario creador
    if (createdById) {
      const creator = await this.userRepository.findById(createdById);
      if (!creator) {
        throw new BadRequestException('El usuario creador no existe');
      }
    }

    // Validar colegio y sede según el rol
    if (role === 'ADMIN') {
      if (!schoolId) {
        throw new BadRequestException(
          'Se requiere el id del colegio para este rol.',
        );
      }
      // Validar existencia del colegio
      const schoolExists = await this.schoolRepository.findById(schoolId);
      if (!schoolExists) {
        throw new BadRequestException(`El colegio ${schoolId} no existe.`);
      }
      // Si se envía sedeId, validar que exista y pertenezca al colegio
      if (sedeId) {
        const sede = await this.sedeRepository.findById(sedeId);
        if (!sede) {
          throw new BadRequestException('La sede proporcionada no existe.');
        }
        if (sede.schoolId !== schoolId) {
          throw new BadRequestException(
            `La sede ${sedeId} no pertenece al colegio ${schoolId}.`,
          );
        }
      }
    } else if (role === 'DOCENTE') {
      if (!schoolId) {
        throw new BadRequestException(
          'Se requiere el id del colegio para este rol.',
        );
      }
      if (!sedeId) {
        throw new BadRequestException(
          'Se requiere el id de la sede para este rol.',
        );
      }
      // Validar existencia de colegio y sede
      const schoolExists = await this.schoolRepository.findById(schoolId);
      if (!schoolExists) {
        throw new BadRequestException(`El colegio ${schoolId} no existe.`);
      }
      const sede = await this.sedeRepository.findById(sedeId);
      if (!sede || sede.school?.id !== schoolId) {
        throw new BadRequestException(
          `La sede ${sedeId} no pertenece al colegio ${schoolId}.`,
        );
      }
    }

    // Crear usuario con contraseña temporal
    const tempPassword = this.generateTempPassword();
    const hashedPassword = await this.passwordService.hash(tempPassword);
    const user = User.create(
      email,
      hashedPassword,
      firstName,
      lastName,
      role,
      createdById,
    );

    // Generar token para establecer contraseña
    const setupToken = this.passwordService.generateResetToken();
    const passwordReset = PasswordReset.create(email, setupToken);
    await this.passwordResetRepository.save(passwordReset);

    try {
      // Guardar usuario
      const savedUser = await this.userRepository.save(user, schoolId, sedeId);

      // Guardar token de reset

      // Enviar email de bienvenida con token
      await this.sendWelcomeEmail(email, firstName, setupToken);

      return {
        user: {
          id: savedUser.id,
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          role: savedUser.role,
          createdById: savedUser.createdById,
          message:
            'Usuario registrado exitosamente. Por favor revisa tu correo para establecer tu contraseña.',
        },
      };
    } catch (error: any) {
      // Si falla el envío del email, eliminar el usuario creado
      try {
        await this.userRepository.delete(user.id);
        // Buscar y eliminar el token de reset si existe
        const passwordResets =
          await this.passwordResetRepository.findByEmail(email);
        for (const reset of passwordResets) {
          await this.passwordResetRepository.delete(reset.id);
        }
      } catch (deleteError) {
        console.error(
          'Error eliminando usuario después de fallo en email:',
          deleteError,
        );
      }
      // Si el error tiene un mensaje específico de email inválido, mostrarlo
      const errorMsg = (error as { message?: string }).message;
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof errorMsg === 'string' &&
        (errorMsg.includes('email is not valid') || errorMsg.includes('email'))
      ) {
        throw new BadRequestException(
          'El correo electrónico proporcionado no es válido.',
        );
      }
      throw new BadRequestException(
        'Error enviando email de bienvenida. El usuario no fue creado. Por favor intenta nuevamente.',
      );
    }
  }

  private isValidRole(role: string): role is Role {
    return Object.values(Role).includes(role as Role);
  }

  private generateTempPassword(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async sendWelcomeEmail(
    email: string,
    firstName: string,
    token: string,
  ): Promise<void> {
    await this.emailService.sendEmailVerification(email, firstName, token);
    console.log(`Email de bienvenida enviado a: ${email}`);
  }
}
