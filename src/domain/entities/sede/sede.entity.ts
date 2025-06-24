import { School } from '@prisma/client';

export class Sede {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly schoolId: string,
    public readonly address?: string,
    public readonly phone?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly school?: School,
  ) {}
}
