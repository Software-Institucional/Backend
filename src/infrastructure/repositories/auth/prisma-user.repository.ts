import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/auth/user.repository';
import { User } from 'src/domain/entities/auth/user.entity';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        school: true,
        sede: true,
      },
    });
    if (!user) return null;

    const userEntity = new User(
      user.id,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.role,
      user.isEmailVerified,
      user.createdById!,
      Boolean(user.activate),
      user.createdAt,
      user.updatedAt,
    );
    userEntity.school = {
      id: user.school?.id ?? '',
      name: user.school?.name ?? '',
      address: user.school?.address ?? undefined,
      phone: user.school?.phone ?? undefined,
      imgUrl: user.school?.imgUrl ?? undefined,
      department: user.school?.department ?? undefined,
      municipality: user.school?.municipality ?? undefined,
      mail: user.school?.mail ?? undefined,
      website: user.school?.website ?? undefined,
      createdAt: user.school?.createdAt ?? new Date(),
      updatedAt: user.school?.updatedAt ?? new Date(),
    };
    userEntity.sede = {
      id: user.sede?.id ?? '',
      name: user.sede?.name ?? '',
      address: user.sede?.address ?? undefined,
      phone: user.sede?.phone ?? undefined,
      createdAt: user.sede?.createdAt ?? new Date(),
      updatedAt: user.sede?.updatedAt ?? new Date(),
    };

    return userEntity;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        school: true,
        sede: true,
      },
    });
    if (!user) return null;

    const userEntity = new User(
      user.id,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.role,
      user.isEmailVerified,
      user.createdById ?? undefined,
      Boolean(user.activate),
      user.createdAt,
      user.updatedAt,
    );
    userEntity.school = {
      id: user.school?.id ?? '',
      name: user.school?.name ?? '',
      address: user.school?.address ?? undefined,
      phone: user.school?.phone ?? undefined,
      imgUrl: user.school?.imgUrl ?? undefined,
      department: user.school?.department ?? undefined,
      municipality: user.school?.municipality ?? undefined,
      mail: user.school?.mail ?? undefined,
      website: user.school?.website ?? undefined,
      createdAt: user.school?.createdAt ?? new Date(),
      updatedAt: user.school?.updatedAt ?? new Date(),
    };
    userEntity.sede = {
      id: user.sede?.id ?? '',
      name: user.sede?.name ?? '',
      address: user.sede?.address ?? undefined,
      phone: user.sede?.phone ?? undefined,
      createdAt: user.sede?.createdAt ?? new Date(),
      updatedAt: user.sede?.updatedAt ?? new Date(),
    };
    return userEntity;
  }

  async save(user: User, schoolId?: string, sedeId?: string): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        activate: user.activate,
        createdById: user.createdById,
        schoolId: schoolId ?? undefined,
        sedeId: sedeId ?? undefined,
      },
      include: {
        school: true,
        sede: true,
      },
    });
    const userEntity = new User(
      createdUser.id,
      createdUser.email,
      createdUser.password,
      createdUser.firstName,
      createdUser.lastName,
      createdUser.role,
      createdUser.isEmailVerified,
      createdUser.createdById ?? undefined,
      Boolean(createdUser.activate),
      createdUser.createdAt,
      createdUser.updatedAt,
    );
    userEntity.school = {
      id: createdUser.school?.id ?? '',
      name: createdUser.school?.name ?? '',
      address: createdUser.school?.address ?? undefined,
      phone: createdUser.school?.phone ?? undefined,
      imgUrl: createdUser.school?.imgUrl ?? undefined,
      department: createdUser.school?.department ?? undefined,
      municipality: createdUser.school?.municipality ?? undefined,
      mail: createdUser.school?.mail ?? undefined,
      website: createdUser.school?.website ?? undefined,
      createdAt: createdUser.school?.createdAt ?? new Date(),
      updatedAt: createdUser.school?.updatedAt ?? new Date(),
    };
    userEntity.sede = {
      id: createdUser.sede?.id ?? '',
      name: createdUser.sede?.name ?? '',
      address: createdUser.sede?.address ?? undefined,
      phone: createdUser.sede?.phone ?? undefined,
      createdAt: createdUser.sede?.createdAt ?? new Date(),
      updatedAt: createdUser.sede?.updatedAt ?? new Date(),
    };
    return userEntity;
  }

  async update(user: User, schoolId?: string, sedeId?: string): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        activate: user.activate,
        updatedAt: new Date(),
        schoolId: schoolId ?? undefined,
        sedeId: sedeId ?? undefined,
      },
      include: {
        school: true,
        sede: true,
      },
    });
    const userEntity = new User(
      updatedUser.id,
      updatedUser.email,
      updatedUser.password,
      updatedUser.firstName,
      updatedUser.lastName,
      updatedUser.role,
      updatedUser.isEmailVerified,
      updatedUser.createdById ?? undefined,
      Boolean(updatedUser.activate),
      updatedUser.createdAt,
      updatedUser.updatedAt,
    );
    userEntity.school = {
      id: updatedUser.school?.id ?? '',
      name: updatedUser.school?.name ?? '',
      address: updatedUser.school?.address ?? undefined,
      phone: updatedUser.school?.phone ?? undefined,
      imgUrl: updatedUser.school?.imgUrl ?? undefined,
      department: updatedUser.school?.department ?? undefined,
      municipality: updatedUser.school?.municipality ?? undefined,
      mail: updatedUser.school?.mail ?? undefined,
      website: updatedUser.school?.website ?? undefined,
      createdAt: updatedUser.school?.createdAt ?? new Date(),
      updatedAt: updatedUser.school?.updatedAt ?? new Date(),
    };
    userEntity.sede = {
      id: updatedUser.sede?.id ?? '',
      name: updatedUser.sede?.name ?? '',
      address: updatedUser.sede?.address ?? undefined,
      phone: updatedUser.sede?.phone ?? undefined,
      createdAt: updatedUser.sede?.createdAt ?? new Date(),
      updatedAt: updatedUser.sede?.updatedAt ?? new Date(),
    };
    return userEntity;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async allUser(id: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: { createdById: id },
      include: {
        school: true,
        sede: true,
      },
    });
    return users.map((user) => {
      const userEntity = new User(
        user.id,
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.role,
        user.isEmailVerified,
        user.createdById ?? undefined,
        Boolean(user.activate),
        user.createdAt,
        user.updatedAt,
      );
      userEntity.school = {
        id: user.school?.id ?? '',
        name: user.school?.name ?? '',
        address: user.school?.address ?? undefined,
        phone: user.school?.phone ?? undefined,
        imgUrl: user.school?.imgUrl ?? undefined,
        department: user.school?.department ?? undefined,
        municipality: user.school?.municipality ?? undefined,
        mail: user.school?.mail ?? undefined,
        website: user.school?.website ?? undefined,
        createdAt: user.school?.createdAt ?? new Date(),
        updatedAt: user.school?.updatedAt ?? new Date(),
      };
      userEntity.sede = {
        id: user.sede?.id ?? '',
        name: user.sede?.name ?? '',
        address: user.sede?.address ?? undefined,
        phone: user.sede?.phone ?? undefined,
        createdAt: user.sede?.createdAt ?? new Date(),
        updatedAt: user.sede?.updatedAt ?? new Date(),
      };
      return userEntity;
    });
  }

  async searchUsersWithFilters(
    search?: string,
    role?: Role,
    schoolId?: string,
    page?: number,
    limit?: number,
    createdById?: string,
    activate?: boolean,
    isEmailVerified?: boolean,
  ): Promise<{ users: User[]; total: number }> {
    const whereCondition: Record<string, any> = {};

    if (search) {
      whereCondition.OR = [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ];
    }
    if (role) {
      whereCondition.role = role;
    }
    if (schoolId) {
      whereCondition.schoolId = schoolId;
    }
    if (createdById) {
      whereCondition.createdById = createdById;
    }
    if (activate !== undefined) {
      whereCondition.activate = activate;
    }
    if (isEmailVerified !== undefined) {
      whereCondition.isEmailVerified = isEmailVerified;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereCondition,
        include: {
          school: true,
          sede: true,
        },
        skip: (page! - 1) * limit!,
        take: limit,
      }),
      this.prisma.user.count({
        where: whereCondition,
      }),
    ]);

    return {
      users: users.map((user) => {
        const userEntity = new User(
          user.id,
          user.email,
          user.password,
          user.firstName,
          user.lastName,
          user.role,
          user.isEmailVerified,
          user.createdById ?? undefined,
          Boolean(user.activate),
          user.createdAt,
          user.updatedAt,
        );
        userEntity.school = {
          id: user.school?.id ?? '',
          name: user.school?.name ?? '',
          address: user.school?.address ?? undefined,
          phone: user.school?.phone ?? undefined,
          imgUrl: user.school?.imgUrl ?? undefined,
          department: user.school?.department ?? undefined,
          municipality: user.school?.municipality ?? undefined,
          mail: user.school?.mail ?? undefined,
          website: user.school?.website ?? undefined,
          createdAt: user.school?.createdAt ?? new Date(),
          updatedAt: user.school?.updatedAt ?? new Date(),
        };
        userEntity.sede = {
          id: user.sede?.id ?? '',
          name: user.sede?.name ?? '',
          address: user.sede?.address ?? undefined,
          phone: user.sede?.phone ?? undefined,
          createdAt: user.sede?.createdAt ?? new Date(),
          updatedAt: user.sede?.updatedAt ?? new Date(),
        };
        return userEntity;
      }),
      total,
    };
  }

  async getUsersStatistics(
    search?: string,
    role?: Role,
    schoolId?: string,
    createdById?: string,
    activate?: boolean,
    isEmailVerified?: boolean,
  ): Promise<{ docentes: number; activos: number; cantidadSedes: number }> {
    const whereCondition: Record<string, any> = {};

    if (search) {
      whereCondition.OR = [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ];
    }
    if (role) {
      whereCondition.role = role;
    }
    if (schoolId) {
      whereCondition.schoolId = schoolId;
    }
    if (createdById) {
      whereCondition.createdById = createdById;
    }
    if (activate !== undefined) {
      whereCondition.activate = activate;
    }
    if (isEmailVerified !== undefined) {
      whereCondition.isEmailVerified = isEmailVerified;
    }

    const [docentes, activos, sedes] = await Promise.all([
      this.prisma.user.count({
        where:
          whereCondition.role && whereCondition.role !== 'DOCENTE'
            ? { AND: [whereCondition, { role: 'DOCENTE' }] }
            : { ...whereCondition, role: 'DOCENTE' },
      }),
      this.prisma.user.count({
        where:
          whereCondition.activate !== undefined && !whereCondition.activate
            ? { AND: [whereCondition, { activate: true }] }
            : { ...whereCondition, activate: true },
      }),
      this.prisma.user.findMany({
        where: { ...whereCondition, sedeId: { not: null } },
        distinct: ['sedeId'],
        select: { sedeId: true },
      }),
    ]);

    return { docentes, activos, cantidadSedes: sedes.length };
  }

  async getAllUsersBySchool(
    search?: string,
    role?: Role,
    page = 1,
    limit = 10,
  ): Promise<{ schools: { school: any; users: User[] }[]; total: number }> {
    const whereCondition: Record<string, any> = {};

    if (search) {
      whereCondition.OR = [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    if (role) {
      whereCondition.role = role;
    }

    // Obtener todos los colegios con sus usuarios
    const schoolsWithUsers = await this.prisma.school.findMany({
      include: {
        users: {
          // No usar where: whereCondition aquí para que el SUPER vea todos los usuarios
          include: {
            school: true,
            sede: true,
          },
        },
      },
    });

    const schoolsData = schoolsWithUsers
      .map((school) => ({
        school: {
          id: school.id,
          name: school.name,
          address: school.address,
          phone: school.phone,
          imgUrl: school.imgUrl,
          department: school.department,
          municipality: school.municipality,
          mail: school.mail,
          website: school.website,
          activate: Boolean(school.activate),
          createdAt: school.createdAt,
          updatedAt: school.updatedAt,
        },
        users: school.users.map((user) => {
          const userEntity = new User(
            user.id,
            user.email,
            user.password,
            user.firstName,
            user.lastName,
            user.role,
            user.isEmailVerified,
            user.createdById ?? undefined,
            Boolean(user.activate),
            user.createdAt,
            user.updatedAt,
          );
          userEntity.school = {
            id: user.school?.id ?? '',
            name: user.school?.name ?? '',
            address: user.school?.address ?? undefined,
            phone: user.school?.phone ?? undefined,
            imgUrl: user.school?.imgUrl ?? undefined,
            department: user.school?.department ?? undefined,
            municipality: user.school?.municipality ?? undefined,
            mail: user.school?.mail ?? undefined,
            website: user.school?.website ?? undefined,
            createdAt: user.school?.createdAt ?? new Date(),
            updatedAt: user.school?.updatedAt ?? new Date(),
          };
          userEntity.sede = {
            id: user.sede?.id ?? '',
            name: user.sede?.name ?? '',
            address: user.sede?.address ?? undefined,
            phone: user.sede?.phone ?? undefined,
            createdAt: user.sede?.createdAt ?? new Date(),
            updatedAt: user.sede?.updatedAt ?? new Date(),
          };
          return userEntity;
        }),
      }))
      .filter((school) => school.users.length > 0); // Solo colegios con usuarios

    // Aplicar paginación
    const total = schoolsData.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSchools = schoolsData.slice(startIndex, endIndex);

    return {
      schools: paginatedSchools,
      total,
    };
  }
}
