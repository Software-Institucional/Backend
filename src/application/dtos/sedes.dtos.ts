import { ApiProperty } from '@nestjs/swagger';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';

export class SedesDtoRequest {
  user: JwtPayload;
  @ApiProperty()
  name: string;
  @ApiProperty()
  codeDANE: string;
  @ApiProperty()
  address?: string;
  @ApiProperty()
  phone?: string;
  @ApiProperty()
  schoolId: string;
  @ApiProperty()
  calendar: string;
  @ApiProperty()
  Zone: string;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  niveles: string[];
}

export class SedesDtoResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  codeDANE?: string;
  @ApiProperty()
  address?: string;
  @ApiProperty()
  phone?: string;
  @ApiProperty()
  schoolId: string;
  @ApiProperty()
  calendar: string;
  @ApiProperty()
  Zone: string;
  @ApiProperty()
  active: boolean;
}

export class UpdateSedeDto {
  @ApiProperty()
  name?: string;
  @ApiProperty()
  codeDANE?: string;
  @ApiProperty()
  address?: string;
  @ApiProperty()
  phone?: string;
  @ApiProperty()
  calendar?: string;
  @ApiProperty()
  Zone?: string;
  @ApiProperty()
  active?: boolean;
  @ApiProperty()
  niveles: string[];
}

export class SedeResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  codeDANE?: string | null;
  @ApiProperty()
  address?: string | null;
  @ApiProperty()
  phone?: string | null;
  @ApiProperty()
  schoolId: string;
  @ApiProperty()
  calendar: string;
  @ApiProperty()
  Zone: string;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
