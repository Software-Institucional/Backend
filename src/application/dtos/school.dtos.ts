import { ApiProperty } from '@nestjs/swagger';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';

export class CreateSchoolRequestDto {
  user: JwtPayload;
  @ApiProperty({ example: 'Escuela Nacional de Ciencias' })
  name: string;
  @ApiProperty({ example: 'Calle 123, Barrio Centro' })
  address: string;
  @ApiProperty({ example: '+50498765432' })
  phone: string;
  @ApiProperty({ example: 'Francisco Morazán' })
  department: string;
  @ApiProperty({ example: 'Tegucigalpa' })
  municipality: string;
  @ApiProperty({ example: 'escuela@email.com' })
  mail: string;
  @ApiProperty({ example: 'https://www.escuela.edu.hn' })
  website: string;
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  image: string;
}

export class CreateSchoolResponseDto {
  @ApiProperty({
    example: {
      id: '1',
      name: 'Escuela Nacional de Ciencias',
      address: 'Calle 123, Barrio Centro',
      phone: '+50498765432',
      imgUrl: 'https://s3.amazonaws.com/bucket/escuela.jpg',
      department: 'Francisco Morazán',
      municipality: 'Tegucigalpa',
      mail: 'escuela@email.com',
      website: 'https://www.escuela.edu.hn',
    },
  })
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

export class SearchSchoolRequestDto {
  @ApiProperty({
    example: 'Escuela Nacional de Ciencias',
    required: false,
  })
  name?: string;
  @ApiProperty({ example: 1, default: 1, required: false })
  page?: number;
  @ApiProperty({ example: 10, default: 10, required: false })
  limit?: number;
}

export class SearchSchoolResponseDto {
  @ApiProperty({
    description: 'Lista de colegios encontrados',
    type: [CreateSchoolResponseDto],
  })
  schools: CreateSchoolResponseDto[];

  @ApiProperty({
    description: 'Metadatos de paginación',
    example: {
      total: 50,
      page: 1,
      limit: 10,
      totalPages: 5,
    },
  })
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class UpdateSchoolRequestDto {
  @ApiProperty({ example: '' })
  id: string;
  user: JwtPayload;
  @ApiProperty({ example: 'Escuela Nacional de Ciencias', required: false })
  name?: string;
  @ApiProperty({ example: 'Calle 123, Barrio Centro', required: false })
  address?: string;
  @ApiProperty({ example: '+50498765432', required: false })
  phone?: string;
  @ApiProperty({ example: 'Francisco Morazán', required: false })
  department?: string;
  @ApiProperty({ example: 'Tegucigalpa', required: false })
  municipality?: string;
  @ApiProperty({ example: 'escuela@email.com', required: false })
  mail?: string;
  @ApiProperty({ example: 'https://www.escuela.edu.hn', required: false })
  website?: string;
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: string;
}
