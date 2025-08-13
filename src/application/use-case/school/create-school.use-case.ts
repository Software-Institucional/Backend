import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  CreateSchoolRequestDto,
  CreateSchoolResponseDto,
} from 'src/application/dtos/school.dtos';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { SchoolRepository } from 'src/domain/repositories/scholl.repository';
import { School } from 'src/domain/entities/school/school.entity';
import { S3Service } from 'src/infrastructure/s3/s3.service';

@Injectable()
export class CreateSchoolUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('SchoolRepository')
    private readonly schoolRepository: SchoolRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    request: CreateSchoolRequestDto,
    file: Express.Multer.File,
  ): Promise<CreateSchoolResponseDto> {
    const userId = request.user.sub;

    if (!userId) {
      throw new Error('User not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.role !== 'SUPER') {
      throw new UnauthorizedException(
        'No tienes permiso para crear un colegio',
      );
    }

    if (!file) {
      throw new Error('No se ha subido una imagen');
    }

    const imgUrl = await this.s3Service.uploadFile(file);

    const school = School.create(
      request.name,
      request.address,
      request.phone,
      imgUrl,
      request.department,
      request.municipality,
      request.mail,
      request.website,
    );

    const savedSchool = await this.schoolRepository.createSchool(school);
    return {
      school: {
        id: savedSchool.id,
        name: savedSchool.name,
        codeDANE: savedSchool.codeDANE!,
        address: savedSchool.address!,
        phone: savedSchool.phone!,
        imgUrl: savedSchool.imgUrl!,
        department: savedSchool.department!,
        municipality: savedSchool.municipality!,
        mail: savedSchool.mail!,
        website: savedSchool.website!,
        sedes: savedSchool.sedes || [],
      },
    };
  }
}
