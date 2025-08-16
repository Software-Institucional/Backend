export class GradoSede {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly sedeId: string,
    public readonly nivelId: string,
    public readonly gradoId: string | null, // null si es personalizado
    public readonly activo: boolean,
    public readonly custom: boolean,
  ) {}
}
