import { Role } from '@prisma/client';
import * as crypto from 'crypto';
import { SedeDto } from 'src/application/dtos/school.dtos';
import { SchoolDto } from 'src/application/dtos/user.dtos';

export class User {
  public school?: SchoolDto;
  public imgUrl?: string;
  public sede?: SedeDto;
  public simatuser?: string;
  public simatpass?: string;

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
    imgUrl?: string,
    simatuser?: string,
    simatpass?: string,
  ) {
    this.imgUrl = imgUrl;
    this.simatuser = simatuser;
    this.simatpass = simatpass;
  }

  static create(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: Role,
    createdById?: string,
    simatuser?: string,
    simatpass?: string,
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
      undefined,
      simatuser,
      simatpass,
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
      this.imgUrl,
      this.simatuser,
      this.simatpass,
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
      this.imgUrl,
      this.simatuser,
      this.simatpass,
    );
  }

  withUpdatedData(data: Partial<User>): User {
    return new User(
      this.id,
      this.email,
      data.password ?? this.password,
      data.firstName ?? this.firstName,
      data.lastName ?? this.lastName,
      this.role,
      this.isEmailVerified,
      this.createdById,
      this.activate,
      this.createdAt,
      new Date(), // siempre se actualiza updatedAt
      data.imgUrl ?? this.imgUrl,
      data.simatuser ?? this.simatuser,
      data.simatpass ?? this.simatpass,
    );
  }
}
