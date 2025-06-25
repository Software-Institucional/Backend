import { Role } from '@prisma/client';
import * as crypto from 'crypto';
import { SchoolEntity } from 'src/domain/interfaces/school.interface';

export class User {
  public schools?: SchoolEntity[];

  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: Role,
    public readonly isEmailVerified: boolean = false,
    public readonly createdById?: string,
    public readonly activate: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: Role,
    createdById?: string,
  ): User {
    return new User(
      crypto.randomUUID(),
      email,
      password,
      firstName,
      lastName,
      role,
      false,
      createdById,
      true,
      new Date(),
      new Date(),
    );
  }

  updatePassword(newPassword: string): User {
    return new User(
      this.id,
      this.email,
      newPassword,
      this.firstName,
      this.lastName,
      this.role,
      this.isEmailVerified,
      this.createdById,
      this.activate,
      this.createdAt,
      new Date(),
    );
  }

  verifyEmail(): User {
    return new User(
      this.id,
      this.email,
      this.password,
      this.firstName,
      this.lastName,
      this.role,
      true,
      this.createdById,
      this.activate,
      this.createdAt,
      new Date(),
    );
  }
}
