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
    activate: boolean;
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

export class AllUserRequestDto {
  @ApiProperty({ example: 'Juan', required: false })
  search?: string;
  @ApiProperty({
    example: 'ADMIN',
    enum: ['SUPER', 'ADMIN', 'DOCENTE'],
    required: false,
  })
  role?: Role;
  @ApiProperty({ example: 'uuid-school', required: false })
  schoolId?: string;
  @ApiProperty({ example: 1, default: 1, required: false })
  page?: number;
  @ApiProperty({ example: 10, default: 10, required: false })
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
        schools: [
          {
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
            sedes: [
              {
                id: 'sede-1',
                name: 'Sede Principal',
                address: 'Calle 123',
                phone: '+57 300 123 4567',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
              },
            ],
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
    schools?: (SchoolDto & {
      sedes: {
        id: string;
        name: string;
        address?: string;
        phone?: string;
        createdAt: Date;
        updatedAt: Date;
      }[];
    })[];
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
            sedes: [
              {
                id: '6e1c4c12-449a-401f-8a46-8ef0dde67df8',
                name: 'Sede Principal',
                address: 'Calle 123 #45-67, Bogotá',
                phone: '+57 300 123 4567',
                createdAt: '2025-06-24T16:43:06.003Z',
                updatedAt: '2025-06-24T16:43:06.003Z',
              },
            ],
          },
        ],
      },
    ],
  })
  schools: {
    school: SchoolDto & {
      activate: boolean;
    };
    users: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: Role;
      isEmailVerified: boolean;
      activate: boolean;
      sedes: {
        id: string;
        name: string;
        address?: string;
        phone?: string;
        createdAt: Date;
        updatedAt: Date;
      }[];
    }[];
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
  @ApiProperty({
    example: [
      { schoolId: 'uuid-colegio-1', sedeIds: ['uuid-sede-1', 'uuid-sede-2'] },
      { schoolId: 'uuid-colegio-2', sedeIds: ['uuid-sede-3'] },
      { schoolId: 'uuid-colegio-3' },
    ],
    required: false,
    description:
      'Lista de colegios y sedes (solo ADMIN y SUPER pueden modificar)',
  })
  schools?: { schoolId: string; sedeIds?: string[] }[];
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
      schools: [
        {
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
          sedes: [
            {
              id: 'sede-1',
              name: 'Sede Principal',
              address: 'Calle 123',
              phone: '+57 300 123 4567',
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-01T00:00:00.000Z',
            },
          ],
        },
      ],
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
    schools?: (SchoolDto & {
      sedes: {
        id: string;
        name: string;
        address?: string;
        phone?: string;
        createdAt: Date;
        updatedAt: Date;
      }[];
    })[];
    message: string;
  };
}
