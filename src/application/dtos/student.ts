import { ApiProperty } from '@nestjs/swagger';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';

export class studentSearch {
  user: JwtPayload;
  @ApiProperty()
  documento: string;
}
