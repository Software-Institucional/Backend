import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class ForgotPasswordRequestDto {
  @ApiProperty({ example: 'usuario@email.com' })
  email: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    example: 'If the email exists, a password reset link has been sent.',
  })
  message: string;
}

export class LoginRequestDto {
  @ApiProperty({ example: '1' })
  schoolId?: string;
  @ApiProperty({ example: 'usuario@email.com' })
  email: string;
  @ApiProperty({ example: 'password123' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty({
    example: {
      id: 'uuid',
      email: 'usuario@email.com',
      firstName: 'Juan',
      lastName: 'Pérez',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    schoolId?: string;
  };
}

export class LogoutRequestDto {
  @ApiProperty({ example: 'refresh-token' })
  refreshToken: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: 'Logged out successfully' })
  message: string;
}

export class RefreshTokenRequestDto {
  @ApiProperty({ example: 'refresh-token' })
  refreshToken: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}

export class RegisterRequestDto {
  @ApiProperty({ example: 'usuario@email.com' })
  email: string;
  @ApiProperty({ example: 'Juan' })
  firstName: string;
  @ApiProperty({ example: 'ADMIN', enum: ['SUPER', 'ADMIN'] })
  role: Role;
  @ApiProperty({ example: 'Pérez' })
  lastName: string;
  @ApiProperty({ example: 'uuid-colegio', required: false })
  schoolId?: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    example: {
      id: 'uuid',
      email: 'usuario@email.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      role: 'ADMIN',
      schoolId: 'uuid-colegio',
      message:
        'Usuario registrado exitosamente. Por favor revisa tu correo para la verificación.',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: Role;
    schoolId?: string;
    message: string;
  };
}

export class ResetPasswordRequestDto {
  @ApiProperty({ example: 'token-reset' })
  token: string;
  @ApiProperty({ example: 'nuevaPassword123' })
  newPassword: string;
}

export class ResetPasswordResponseDto {
  @ApiProperty({
    example:
      'Password has been reset successfully. Please log in with your new password.',
  })
  message: string;
}
