import * as crypto from 'crypto';

export interface SedeEntity {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class School {
  public sedes?: SedeEntity[];

  constructor(
    public readonly id: string,
    public readonly name: string,
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
