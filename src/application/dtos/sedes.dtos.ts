import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';

export class SedesDtoRequest {
  user: JwtPayload;
  name: string;
  address?: string;
  phone?: string;
  schoolId: string;
}

export class SedesDtoResponse {
  name: string;
  address?: string;
  phone?: string;
  schoolId: string;
}
