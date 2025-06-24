import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/auth/user.repository';
import { User } from 'src/domain/entities/auth/user.entity';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

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
      savedUser.createdAt,
      savedUser.updatedAt,
    );
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        updatedAt: new Date(),
      },
    });

    return new User(
      updatedUser.id,
      updatedUser.email,
      updatedUser.password,
      updatedUser.firstName,
      updatedUser.lastName,
      updatedUser.role,
      updatedUser.isEmailVerified,
      updatedUser.createdById!,
      updatedUser.createdAt,
      updatedUser.updatedAt,
    );
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
}
