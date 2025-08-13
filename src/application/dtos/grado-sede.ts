import { ApiProperty } from '@nestjs/swagger';

export class GradoSedeResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  sedeId: string;
  @ApiProperty()
  nivelId: string;
  @ApiProperty()
  gradoId: string | null;
  @ApiProperty()
  activo: boolean;
  @ApiProperty()
  custom: boolean;
}

export class CreateGradoSedeDto {
  @ApiProperty({ example: 'CLEI' })
  name: string;
}
