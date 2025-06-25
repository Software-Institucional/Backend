import { User } from 'src/domain/entities/auth/user.entity';
import { Role } from '@prisma/client';

export interface SchoolData {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  imgUrl?: string;
  department?: string;
  municipality?: string;
  mail?: string;
  website?: string;
  activate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(
    user: User,
    schools?: { schoolId: string; sedeIds?: string[] }[],
  ): Promise<User>;
  update(
    user: User,
    schools?: { schoolId: string; sedeIds?: string[] }[],
  ): Promise<User>;
  delete(id: string): Promise<void>;
  allUser(id: string): Promise<User[]>;
  searchUsersWithFilters(
    search?: string,
    role?: Role,
    schoolId?: string,
    page?: number,
    limit?: number,
  ): Promise<{ users: User[]; total: number }>;
  getAllUsersBySchool(
    search?: string,
    role?: Role,
    page?: number,
    limit?: number,
  ): Promise<{
    schools: { school: SchoolData; users: User[] }[];
    total: number;
  }>;
}
