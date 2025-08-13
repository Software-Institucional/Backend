import { ApiProperty } from '@nestjs/swagger';

export class CreateCursoDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  codeOfficial: number;
}

export class UpdateCursoDto {
  @ApiProperty()
  nombre?: string;
  @ApiProperty()
  activo?: boolean;
}

export class CursoResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  gradoSedeId: string;
  @ApiProperty()
  activo: boolean;
}
