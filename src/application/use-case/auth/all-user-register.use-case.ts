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

    const { search, role, schoolId, page = 1, limit = 10 } = request;

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
          users: schoolData.users.map((u) => {
            // Encontrar las sedes específicas de este colegio para este usuario
            const userSchool = u.schools?.find(
              (s) => s.id === schoolData.school.id,
            );
            const sedes = userSchool?.sedes || [];

            return {
              id: u.id,
              email: u.email,
              firstName: u.firstName,
              lastName: u.lastName,
              role: u.role,
              isEmailVerified: u.isEmailVerified,
              activate: u.activate,
              sedes: sedes,
            };
          }),
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
          schools: u.schools,
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
        users: schoolData.users.map((u) => {
          // Encontrar las sedes específicas de este colegio para este usuario
          const userSchool = u.schools?.find(
            (s) => s.id === schoolData.school.id,
          );
          const sedes = userSchool?.sedes || [];

          return {
            id: u.id,
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
            role: u.role,
            isEmailVerified: u.isEmailVerified,
            activate: u.activate,
            sedes: sedes,
          };
        }),
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
