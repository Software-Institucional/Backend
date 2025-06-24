import { User } from 'src/domain/entities/auth/user.entity';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(
    user: User,
    schools?: { schoolId: string; sedeIds?: string[] }[],
  ): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  allUser(id: string): Promise<User[]>;
}
