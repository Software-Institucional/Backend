import * as crypto from 'crypto';
import { SedeDto } from 'src/application/dtos/school.dtos';

export class School {
  public sedes?: SedeDto[];

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly codeDANE?: string,
    public readonly address?: string,
    public readonly phone?: string,
    public readonly imgUrl?: string,
    public readonly department?: string,
    public readonly municipality?: string,
    public readonly mail?: string,
    public readonly website?: string,
    public readonly activate?: boolean,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    name: string,
    codeDANE?: string,
    address?: string,
    phone?: string,
    imgUrl?: string,
    department?: string,
    municipality?: string,
    mail?: string,
    website?: string,
  ): School {
    const id = crypto.randomUUID();

    return new School(
      id,
      name,
      codeDANE,
      address,
      phone,
      imgUrl,
      department,
      municipality,
      mail,
      website,
    );
  }
}
