import { ApiProperty } from '@nestjs/swagger';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';

export class CreateSchoolRequestDto {
  user: JwtPayload;
  @ApiProperty()
  name: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  department: string;
  @ApiProperty()
  municipality: string;
  @ApiProperty()
  mail: string;
  @ApiProperty()
  website: string;
}

export class CreateSchoolResponseDto {
  @ApiProperty()
  school: {
    id: string;
    name: string;
    address: string;
    phone: string;
    imgUrl: string;
    department: string;
    municipality: string;
    mail: string;
    website: string;
  };
}
