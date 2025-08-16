import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { SedeDto } from './school.dtos';

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
  schoolId: string;
  @ApiProperty({ example: 'usuario@email.com' })
  email: string;
  @ApiProperty({ example: 'password123' })
  password: string;
}
export class LoginSuperRequestDto {
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
    activate: boolean;
    simatuser?: string | null;
    simatpass?: string | null;
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
  @ApiProperty()
  schoolId?: string;
  @ApiProperty()
  sedeId?: string;
  @ApiProperty({
    example: 'uuid-creador',
    required: false,
    description: 'ID del usuario que crea este usuario',
  })
  createdById?: string;
}

export class RegisterResponseDto {
  @ApiProperty()
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: Role;
    school?: SchoolDto;
    sede?: SedeDto;
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
      'La contraseña ha sido restablecida exitosamente. Por favor inicia sesión con tu nueva contraseña.',
  })
  message: string;
}

export class SchoolDto {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  imgUrl?: string;
  department?: string;
  municipality?: string;
  mail?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AllUserRequestDto {
  @ApiPropertyOptional({
    description: 'Búsqueda por nombre, apellido o email',
    example: 'Juan',
  })
  search?: string;

  @ApiPropertyOptional({
    enum: ['SUPER', 'ADMIN', 'DOCENTE'],
    description: 'Filtrar por rol de usuario',
  })
  role?: Role;

  @ApiPropertyOptional({
    description: 'Filtrar si el usuario está activo',
    example: true,
  })
  activate?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar si el usuario tiene email verificado',
    example: true,
  })
  isEmailVerified?: boolean;

  @ApiPropertyOptional({
    description: 'ID del colegio',
    example: 'uuid-school',
  })
  schoolId?: string;

  @ApiPropertyOptional({
    description: 'Página de paginación',
    example: 1,
    default: 1,
  })
  page?: number;

  @ApiPropertyOptional({
    description: 'Límite de resultados por página',
    example: 10,
    default: 10,
  })
  limit?: number;
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
        activate: true,
        school: {
          id: 'uuid-school',
          name: 'Colegio A',
          address: 'Calle 123',
          phone: '123456',
          imgUrl: 'https://example.com/image.jpg',
          department: 'Antioquia',
          municipality: 'Medellín',
          mail: 'colegio@mail.com',
          website: 'www.colegio.com',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        sedes: null,
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
    activate: boolean;
    school?: SchoolDto | null;
    sedes: SedeDto | null;
  }[];

  @ApiProperty({
    description: 'Metadatos de paginación',
    example: {
      total: 50,
      page: 1,
      limit: 10,
      totalPages: 5,
    },
  })
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class AllUsersBySchoolResponseDto {
  @ApiProperty({
    description: 'Lista de colegios con sus usuarios',
    example: [
      {
        school: {
          id: 'uuid-school-1',
          name: 'ESCUELA NORMAL SUPERIOR DE ACACIAS',
          address: 'AV. 23 # 41 - 50 FRENTE A LA UNAD',
          phone: '143229982',
          imgUrl:
            'https://eduadminsoft-s3.s3.amazonaws.com/schools/6e2db151-d4bf-43f2-b20f-3efd09be104b-acacias.jpg',
          department: 'META',
          municipality: 'ACACIAS',
          mail: 'ensaacacias@yahoo.es',
          website: 'http://www.ensaacacias.edu.co',
          activate: true,
          createdAt: '2025-06-24T16:39:02.774Z',
          updatedAt: '2025-06-24T16:39:02.774Z',
        },
        users: [
          {
            id: 'uuid-user-1',
            email: 'codecraf.2005@gmail.com',
            firstName: 'test',
            lastName: 'TEST',
            role: 'DOCENTE',
            isEmailVerified: false,
            activate: true,
            sedes: null,
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
    activate: boolean;
    sedes: SedeDto | null;
  }[];
  @ApiProperty({
    description: 'Metadatos de paginación',
    example: {
      total: 50,
      page: 1,
      limit: 10,
      totalPages: 5,
    },
  })
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class UserMetadataResponseDto {
  @ApiProperty()
  total: number;
  @ApiProperty()
  totalUsers: number;
  @ApiProperty()
  activos: number;
  @ApiProperty()
  docentes: number;
  @ApiProperty()
  cantidadSedes: number;
}

export class UpdateUserRequestDto {
  @ApiProperty({ example: 'uuid-user-to-update' })
  id: string;
  @ApiProperty({ example: 'usuario@email.com', required: false })
  email?: string;
  @ApiProperty({ example: 'Juan', required: false })
  firstName?: string;
  @ApiProperty({ example: 'Pérez', required: false })
  lastName?: string;
  @ApiProperty({
    example: 'ADMIN',
    enum: ['SUPER', 'ADMIN', 'DOCENTE'],
    required: false,
  })
  role?: Role;
  @ApiProperty({ example: true, required: false })
  activate?: boolean;
  @ApiProperty()
  schools?: { schoolId: string; sedeIds?: string[] }[];
  @ApiProperty({ example: 'uuid-school', required: false })
  schoolId?: string;
  @ApiProperty({ example: 'uuid-sede', required: false })
  sedeId?: string;
}

export class UpdateUserResponseDto {
  @ApiProperty({
    example: {
      id: 'uuid-user',
      email: 'usuario@email.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      role: 'ADMIN',
      isEmailVerified: true,
      activate: true,
      school: {
        id: 'uuid-school',
        name: 'Colegio A',
        address: 'Calle 123',
        phone: '123456',
        imgUrl: 'https://example.com/image.jpg',
        department: 'Antioquia',
        municipality: 'Medellín',
        mail: 'colegio@mail.com',
        website: 'www.colegio.com',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      sedes: null,
      message: 'Usuario actualizado exitosamente',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    isEmailVerified: boolean;
    activate: boolean;
    school?: SchoolDto | null;
    sedes: SedeDto | null;
    message: string;
  };
}

export class DeleteResponseDto {
  message: string;
}

export class UpdateMyProfileDto {
  @ApiPropertyOptional({ description: 'Nuevo nombre', example: 'Juan' })
  firstName?: string;

  @ApiPropertyOptional({ description: 'Nuevo apellido', example: 'Pérez' })
  lastName?: string;

  // No incluyas imgUrl aquí, porque la imagen se sube como archivo (file)
  @ApiPropertyOptional({
    description: 'Contraseña actual (para cambiar password)',
  })
  currentPassword?: string;

  @ApiPropertyOptional({ description: 'Nueva contraseña' })
  newPassword?: string;
  @ApiPropertyOptional({ description: 'username Simat' })
  simatuser?: string;
  @ApiPropertyOptional({ description: 'simatpass Simat' })
  simatpass?: string;
  @ApiPropertyOptional({ description: 'simatpass Simat' })
  imgUrl?: string;
}

export class MyProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  imgUrl?: string;

  @ApiProperty({ enum: Role })
  role: Role;
}
