export interface SedeEntity {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SchoolEntity {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  imgUrl?: string;
  department?: string;
  municipality?: string;
  mail?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
  sedes: SedeEntity[];
}
