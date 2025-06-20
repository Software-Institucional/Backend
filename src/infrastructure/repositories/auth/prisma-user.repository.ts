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
    });

    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.role,
      user.schoolId ?? undefined,
      user.isEmailVerified,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.role,
      user.schoolId!,
      user.isEmailVerified,
      user.createdAt,
      user.updatedAt,
    );
  }

  async save(user: User): Promise<User> {
    // Si el usuario es SUPER, no debe tener schoolId
    const data = {
      id: user.id,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      ...(user.role !== 'SUPER' && { schoolId: user.schoolId }),
    };

    const savedUser = await this.prisma.user.create({
      data,
    });

    return new User(
      savedUser.id,
      savedUser.email,
      savedUser.password,
      savedUser.firstName,
      savedUser.lastName,
      savedUser.role,
      savedUser.schoolId ?? undefined,
      savedUser.isEmailVerified,
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
        schoolId: user.schoolId,
        isEmailVerified: user.isEmailVerified,
        updatedAt: user.updatedAt,
      },
    });

    return new User(
      updatedUser.id,
      updatedUser.email,
      updatedUser.password,
      updatedUser.firstName,
      updatedUser.lastName,
      updatedUser.role,
      updatedUser.schoolId!,
      updatedUser.isEmailVerified,
      updatedUser.createdAt,
      updatedUser.updatedAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
