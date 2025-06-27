import { Inject, Injectable } from '@nestjs/common';
import {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
} from 'src/application/dtos/user.dtos';
import { PasswordReset } from 'src/domain/entities/auth/password-reset.entity';
import { PasswordResetRepository } from 'src/domain/repositories/auth/password-reset.repository';
import { UserRepository } from 'src/domain/repositories/auth/user.repository';
import { EmailService } from 'src/domain/services/email.service';
import { PasswordService } from 'src/domain/services/password.service';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('PasswordResetRepository')
    private readonly passwordResetRepository: PasswordResetRepository,
    @Inject('PasswordService')
    private readonly passwordService: PasswordService,
    @Inject('EmailService') private readonly emailService: EmailService,
  ) {}

  async execute(
    request: ForgotPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    // Check if user exists
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        message:
          'Si el email existe, se ha enviado un enlace para restablecer la contraseña.',
      };
    }

    // Generate reset token
    const resetToken = this.passwordService.generateResetToken();

    // Create password reset entity
    const passwordReset = PasswordReset.create(request.email, resetToken);

    // Save password reset
    await this.passwordResetRepository.save(passwordReset);

    // Send reset email
    try {
      await this.emailService.sendPasswordResetEmail(request.email, resetToken);
      console.log(`Email de restablecimiento enviado a: ${request.email}`);
    } catch (error) {
      console.error(
        `Error enviando email de restablecimiento a ${request.email}:`,
        error instanceof Error ? error.message : String(error),
      );
      // No lanzar error para no revelar si el email existe
    }

    return {
      message:
        'Si el email existe, se ha enviado un enlace para restablecer la contraseña.',
    };
  }
}
