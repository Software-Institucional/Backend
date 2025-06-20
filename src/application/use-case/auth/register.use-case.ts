import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { User } from 'src/domain/entities/auth/user.entity';
import { UserRepository } from 'src/domain/repositories/auth/user.repository';
import { EmailService } from 'src/domain/services/email.service';
import { PasswordService } from 'src/domain/services/password.service';
import * as crypto from 'crypto';
import { PasswordReset } from 'src/domain/entities/auth/password-reset.entity';
import { PasswordResetRepository } from 'src/domain/repositories/auth/password-reset.repository';
import {
  RegisterRequestDto,
  RegisterResponseDto,
} from 'src/application/dtos/user.dtos';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('PasswordService')
    private readonly passwordService: PasswordService,
    @Inject('EmailService') private readonly emailService: EmailService,
    @Inject('PasswordResetRepository')
    private readonly passwordResetRepository: PasswordResetRepository,
  ) {}

  async execute(request: RegisterRequestDto): Promise<RegisterResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con este email');
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await this.passwordService.hash(tempPassword);

    // Create user
    const user = User.create(
      request.email,
      hashedPassword,
      request.firstName,
      request.lastName,
      request.Role,
      request.shoolId,
    );

    // Save user
    const savedUser = await this.userRepository.save(user);

    // 1. Genera el token
    const resetToken = this.passwordService.generateResetToken();

    // 2. Crea y guarda el registro en PasswordReset
    const passwordReset = PasswordReset.create(savedUser.email, resetToken);
    await this.passwordResetRepository.save(passwordReset);

    // 3. Envía el correo de cambio de contraseña
    await this.emailService.sendPasswordResetEmail(savedUser.email, resetToken);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        shoolId: savedUser.schoolId!,
        message:
          'Usuario registrado exitosamente. Por favor revisa tu correo para la verificación.',
      },
    };
  }
}
