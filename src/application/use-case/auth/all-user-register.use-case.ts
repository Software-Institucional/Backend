import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AllUserRequestDto,
  AllUserResponseDto,
  AllUsersBySchoolResponseDto,
} from 'src/application/dtos/user.dtos';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';
import { UserRepository } from 'src/domain/repositories/auth/user.repository';

@Injectable()
export class AllUSerUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async allUser(
    request: { user: JwtPayload } & AllUserRequestDto,
  ): Promise<AllUserResponseDto | AllUsersBySchoolResponseDto> {
    const userId = request.user.sub;

    if (!userId) {
      throw new Error('User not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Convertir page y limit a números
    const page = parseInt(request.page?.toString() || '1', 10);
    const limit = parseInt(request.limit?.toString() || '10', 10);
    const { search, role, schoolId } = request;

    // Para SUPER: ver todos los usuarios agrupados por colegio
    if (user.role === 'SUPER') {
      const { schools, total } = await this.userRepository.getAllUsersBySchool(
        search,
        role,
        page,
        limit,
      );

      const totalPages = Math.ceil(total / limit);

      return {
        schools: schools.map((schoolData) => ({
          school: {
            id: schoolData.school.id,
            name: schoolData.school.name,
            address: schoolData.school.address,
            phone: schoolData.school.phone,
            imgUrl: schoolData.school.imgUrl,
            department: schoolData.school.department,
            municipality: schoolData.school.municipality,
            mail: schoolData.school.mail,
            website: schoolData.school.website,
            activate: schoolData.school.activate,
            createdAt: schoolData.school.createdAt,
            updatedAt: schoolData.school.updatedAt,
          },
          users: schoolData.users.map((u) => ({
            id: u.id,
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
            role: u.role,
            isEmailVerified: u.isEmailVerified,
            activate: u.activate,
            school: u.school
              ? {
                  id: u.school.id,
                  name: u.school.name,
                  address: u.school.address,
                  phone: u.school.phone,
                  imgUrl: u.school.imgUrl,
                  department: u.school.department,
                  municipality: u.school.municipality,
                  mail: u.school.mail,
                  website: u.school.website,
                  createdAt: u.school.createdAt,
                  updatedAt: u.school.updatedAt,
                }
              : null,
            sedes:
              u.sede && u.sede.id
                ? [
                    {
                      id: u.sede.id,
                      name: u.sede.name,
                      address: u.sede.address,
                      phone: u.sede.phone,
                      createdAt: u.sede.createdAt,
                      updatedAt: u.sede.updatedAt,
                    },
                  ]
                : [],
          })),
        })),
        metadata: {
          total,
          page,
          limit,
          totalPages,
        },
      } as AllUsersBySchoolResponseDto;
    }

    // Para ADMIN: ver usuarios que han creado
    if (user.role === 'ADMIN') {
      const { users, total } = await this.userRepository.searchUsersWithFilters(
        search,
        role,
        schoolId,
        page,
        limit,
        user.id,
      );

      const totalPages = Math.ceil(total / limit);

      return {
        users: users.map((u) => ({
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
          isEmailVerified: u.isEmailVerified,
          activate: u.activate,
          sedes:
            u.sede && u.sede.id
              ? [
                  {
                    id: u.sede.id,
                    name: u.sede.name,
                    address: u.sede.address,
                    phone: u.sede.phone,
                    createdAt: u.sede.createdAt,
                    updatedAt: u.sede.updatedAt,
                  },
                ]
              : [],
        })),
        metadata: {
          total,
          page,
          limit,
          totalPages,
        },
      } as AllUserResponseDto;
    }

    // Para USER: ver todos los usuarios agrupados por colegio
    const { schools, total } = await this.userRepository.getAllUsersBySchool(
      search,
      role,
      page,
      limit,
    );

    const totalPages = Math.ceil(total / limit);

    return {
      schools: schools.map((schoolData) => ({
        school: {
          id: schoolData.school.id,
          name: schoolData.school.name,
          address: schoolData.school.address,
          phone: schoolData.school.phone,
          imgUrl: schoolData.school.imgUrl,
          department: schoolData.school.department,
          municipality: schoolData.school.municipality,
          mail: schoolData.school.mail,
          website: schoolData.school.website,
          activate: schoolData.school.activate,
          createdAt: schoolData.school.createdAt,
          updatedAt: schoolData.school.updatedAt,
        },
        users: schoolData.users.map((u) => ({
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
          isEmailVerified: u.isEmailVerified,
          activate: u.activate,
          sedes:
            u.sede && u.sede.id
              ? [
                  {
                    id: u.sede.id,
                    name: u.sede.name,
                    address: u.sede.address,
                    phone: u.sede.phone,
                    createdAt: u.sede.createdAt,
                    updatedAt: u.sede.updatedAt,
                  },
                ]
              : [],
        })),
      })),
      metadata: {
        total,
        page,
        limit,
        totalPages,
      },
    } as AllUsersBySchoolResponseDto;
  }
}
