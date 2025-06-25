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
        schools: { include: { school: true, sede: true } },
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
    userEntity.schools = user.schools.map((s) => ({
      id: s.school.id,
      name: s.school.name,
      address: s.school.address ?? undefined,
      phone: s.school.phone ?? undefined,
      imgUrl: s.school.imgUrl ?? undefined,
      department: s.school.department ?? undefined,
      municipality: s.school.municipality ?? undefined,
      mail: s.school.mail ?? undefined,
      website: s.school.website ?? undefined,
      createdAt: s.school.createdAt,
      updatedAt: s.school.updatedAt,
      sedes:
        s.sede && typeof s.sede === 'object'
          ? [
              {
                id: s.sede.id,
                name: s.sede.name,
                address: s.sede.address ?? undefined,
                phone: s.sede.phone ?? undefined,
                createdAt: s.sede.createdAt,
                updatedAt: s.sede.updatedAt,
              },
            ]
          : [],
    }));
    return userEntity;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { schools: { include: { school: true, sede: true } } },
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
    userEntity.schools = user.schools.map((s) => ({
      id: s.school.id,
      name: s.school.name,
      address: s.school.address ?? undefined,
      phone: s.school.phone ?? undefined,
      imgUrl: s.school.imgUrl ?? undefined,
      department: s.school.department ?? undefined,
      municipality: s.school.municipality ?? undefined,
      mail: s.school.mail ?? undefined,
      website: s.school.website ?? undefined,
      createdAt: s.school.createdAt,
      updatedAt: s.school.updatedAt,
      sedes:
        s.sede && typeof s.sede === 'object'
          ? [
              {
                id: s.sede.id,
                name: s.sede.name,
                address: s.sede.address ?? undefined,
                phone: s.sede.phone ?? undefined,
                createdAt: s.sede.createdAt,
                updatedAt: s.sede.updatedAt,
              },
            ]
          : [],
    }));
    return userEntity;
  }

  async save(
    user: User,
    schools?: { schoolId: string; sedeIds?: string[] }[],
  ): Promise<User> {
    const savedUser = await this.prisma.$transaction(async (prisma) => {
      const createdUser = await prisma.user.create({
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
        },
      });

      if (schools && schools.length > 0) {
        for (const school of schools) {
          if (school.sedeIds && school.sedeIds.length > 0) {
            for (const sedeId of school.sedeIds) {
              await prisma.schoolsOnUsers.create({
                data: {
                  userId: createdUser.id,
                  schoolId: school.schoolId,
                  sedeId: sedeId,
                },
              });
            }
          } else {
            await prisma.schoolsOnUsers.create({
              data: {
                userId: createdUser.id,
                schoolId: school.schoolId,
              },
            });
          }
        }
      }
      return createdUser;
    });

    return new User(
      savedUser.id,
      savedUser.email,
      savedUser.password,
      savedUser.firstName,
      savedUser.lastName,
      savedUser.role,
      savedUser.isEmailVerified,
      savedUser.createdById!,
      Boolean(savedUser.activate),
      savedUser.createdAt,
      savedUser.updatedAt,
    );
  }

  async update(
    user: User,
    schools?: { schoolId: string; sedeIds?: string[] }[],
  ): Promise<User> {
    const updatedUser = await this.prisma.$transaction(async (prisma) => {
      const updated = await prisma.user.update({
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
        },
      });

      // Si se proporcionan schools, actualizar las relaciones
      if (schools && schools.length > 0) {
        // Eliminar relaciones existentes
        await prisma.schoolsOnUsers.deleteMany({
          where: { userId: user.id },
        });

        // Crear nuevas relaciones
        for (const school of schools) {
          if (school.sedeIds && school.sedeIds.length > 0) {
            for (const sedeId of school.sedeIds) {
              await prisma.schoolsOnUsers.create({
                data: {
                  userId: user.id,
                  schoolId: school.schoolId,
                  sedeId: sedeId,
                },
              });
            }
          } else {
            await prisma.schoolsOnUsers.create({
              data: {
                userId: user.id,
                schoolId: school.schoolId,
              },
            });
          }
        }
      }

      return updated;
    });

    // Obtener el usuario actualizado con sus relaciones
    const userWithRelations = await this.findById(updatedUser.id);
    return userWithRelations!;
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
        schools: { include: { school: true, sede: true } },
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
        user.createdById!,
        Boolean(user.activate),
        user.createdAt,
        user.updatedAt,
      );
      userEntity.schools = user.schools.map((s) => ({
        id: s.school.id,
        name: s.school.name,
        address: s.school.address ?? undefined,
        phone: s.school.phone ?? undefined,
        imgUrl: s.school.imgUrl ?? undefined,
        department: s.school.department ?? undefined,
        municipality: s.school.municipality ?? undefined,
        mail: s.school.mail ?? undefined,
        website: s.school.website ?? undefined,
        createdAt: s.school.createdAt,
        updatedAt: s.school.updatedAt,
        sedes:
          s.sede && typeof s.sede === 'object'
            ? [
                {
                  id: s.sede.id,
                  name: s.sede.name,
                  address: s.sede.address ?? undefined,
                  phone: s.sede.phone ?? undefined,
                  createdAt: s.sede.createdAt,
                  updatedAt: s.sede.updatedAt,
                },
              ]
            : [],
      }));
      return userEntity;
    });
  }

  async searchUsersWithFilters(
    search?: string,
    role?: Role,
    schoolId?: string,
    page = 1,
    limit = 10,
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
      whereCondition.schools = {
        some: {
          schoolId: schoolId,
        },
      };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: whereCondition,
        include: {
          schools: { include: { school: true, sede: true } },
        },
        skip: (page - 1) * limit,
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
          user.createdById!,
          Boolean(user.activate),
          user.createdAt,
          user.updatedAt,
        );
        userEntity.schools = user.schools.map((s) => ({
          id: s.school.id,
          name: s.school.name,
          address: s.school.address ?? undefined,
          phone: s.school.phone ?? undefined,
          imgUrl: s.school.imgUrl ?? undefined,
          department: s.school.department ?? undefined,
          municipality: s.school.municipality ?? undefined,
          mail: s.school.mail ?? undefined,
          website: s.school.website ?? undefined,
          createdAt: s.school.createdAt,
          updatedAt: s.school.updatedAt,
          sedes:
            s.sede && typeof s.sede === 'object'
              ? [
                  {
                    id: s.sede.id,
                    name: s.sede.name,
                    address: s.sede.address ?? undefined,
                    phone: s.sede.phone ?? undefined,
                    createdAt: s.sede.createdAt,
                    updatedAt: s.sede.updatedAt,
                  },
                ]
              : [],
        }));
        return userEntity;
      }),
      total,
    };
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
          where: whereCondition,
          include: {
            user: {
              include: {
                schools: { include: { school: true, sede: true } },
              },
            },
          },
        },
      },
    });

    const schoolsData = schoolsWithUsers
      .map((school) => ({
        school: {
          id: school.id,
          name: school.name,
          address: school.address ?? undefined,
          phone: school.phone ?? undefined,
          imgUrl: school.imgUrl ?? undefined,
          department: school.department ?? undefined,
          municipality: school.municipality ?? undefined,
          mail: school.mail ?? undefined,
          website: school.website ?? undefined,
          activate: Boolean(school.activate),
          createdAt: school.createdAt,
          updatedAt: school.updatedAt,
        },
        users: school.users.map((su) => {
          const user = su.user;
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
          userEntity.schools = user.schools.map((s) => ({
            id: s.school.id,
            name: s.school.name,
            address: s.school.address ?? undefined,
            phone: s.school.phone ?? undefined,
            imgUrl: s.school.imgUrl ?? undefined,
            department: s.school.department ?? undefined,
            municipality: s.school.municipality ?? undefined,
            mail: s.school.mail ?? undefined,
            website: s.school.website ?? undefined,
            createdAt: s.school.createdAt,
            updatedAt: s.school.updatedAt,
            sedes:
              s.sede && typeof s.sede === 'object'
                ? [
                    {
                      id: s.sede.id,
                      name: s.sede.name,
                      address: s.sede.address ?? undefined,
                      phone: s.sede.phone ?? undefined,
                      createdAt: s.sede.createdAt,
                      updatedAt: s.sede.updatedAt,
                    },
                  ]
                : [],
          }));
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
