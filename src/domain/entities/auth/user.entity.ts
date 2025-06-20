import { Role } from '@prisma/client';
import * as crypto from 'crypto';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: Role,
    public readonly schoolId?: string,
    public readonly isEmailVerified: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: Role,
    schoolId?: string,
  ): User {
    return new User(
      crypto.randomUUID(),
      email,
      password,
      firstName,
      lastName,
      role,
      schoolId,
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
      this.schoolId,
      this.isEmailVerified,
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
      this.schoolId,
      true,
      this.createdAt,
      new Date(),
    );
  }
}
