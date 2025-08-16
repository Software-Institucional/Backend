import { School } from '@prisma/client';

export class Sede {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly schoolId: string,
    public readonly calendar: string,
    public readonly Zone: string,
    public readonly active: boolean = true,
    public readonly address?: string,
    public readonly phone?: string,
    public readonly codeDANE?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly school?: School,
    public readonly niveles?: { id: string; name: string }[], // <-- aquí el cambio
  ) {}
}
