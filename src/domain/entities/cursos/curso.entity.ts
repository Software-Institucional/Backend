export class Curso {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly codeOfficial: number,
    public readonly gradoSedeId: string,
    public readonly activo: boolean = true,
  ) {}
}
