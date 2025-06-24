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
      role: 'ADMIN',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
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
  @ApiProperty({ example: 'ADMIN', enum: ['SUPER', 'ADMIN', 'DOCENTE'] })
  role: Role;
  @ApiProperty({ example: 'Pérez' })
  lastName: string;
  @ApiProperty({
    example: [
      { schoolId: 'uuid-colegio-1', sedeIds: ['uuid-sede-1', 'uuid-sede-2'] },
      { schoolId: 'uuid-colegio-2', sedeIds: ['uuid-sede-3'] },
      { schoolId: 'uuid-colegio-3' },
    ],
    required: false,
    description:
      'Lista de colegios y sedes (opcional) a los que el usuario tendrá acceso',
  })
  schools?: { schoolId: string; sedeIds?: string[] }[];
  @ApiProperty({
    example: 'uuid-creador',
    required: false,
    description: 'ID del usuario que crea este usuario',
  })
  createdById?: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    example: {
      id: 'uuid',
      email: 'usuario@email.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      role: 'ADMIN',
      schoolId: ['uuid-colegio'],
      message:
        'Usuario registrado exitosamente. Por favor revisa tu correo para la verificación.',
      createdById: 'uuid-creador',
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
    createdById?: string;
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

export class SchoolDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ required: false })
  address?: string;
  @ApiProperty({ required: false })
  phone?: string;
  @ApiProperty({ required: false })
  imgUrl?: string;
  @ApiProperty({ required: false })
  department?: string;
  @ApiProperty({ required: false })
  municipality?: string;
  @ApiProperty({ required: false })
  mail?: string;
  @ApiProperty({ required: false })
  website?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class AllUserResponseDto {
  @ApiProperty({
    isArray: true,
    example: [
      {
        id: 'uuid-user-1',
        email: 'user1@email.com',
        firstName: 'Usuario',
        lastName: 'Uno',
        role: 'DOCENTE',
        isEmailVerified: true,
        schools: [
          {
            id: 'uuid-school',
            name: 'Colegio A',
            address: 'Calle 123',
            phone: '123456',
            imgUrl: null,
            department: 'Antioquia',
            municipality: 'Medellín',
            mail: 'colegio@mail.com',
            website: 'www.colegio.com',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    ],
  })
  users: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    isEmailVerified: boolean;
    schools?: SchoolDto[];
  }[];
}
