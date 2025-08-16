import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  CreateSchoolResponseDto,
  UpdateSchoolRequestDto,
} from 'src/application/dtos/school.dtos';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { SchoolRepository } from 'src/domain/repositories/scholl.repository';
import { School } from 'src/domain/entities/school/school.entity';
import { S3Service } from 'src/infrastructure/s3/s3.service';

@Injectable()
export class UpdateSchoolUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('SchoolRepository')
    private readonly schoolRepository: SchoolRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(
    request: UpdateSchoolRequestDto,
    file?: Express.Multer.File,
  ): Promise<CreateSchoolResponseDto> {
    const userId = request.user.sub;

    if (!userId) {
      throw new Error('User not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.role !== 'SUPER' && user.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'No tienes permiso para actualizar un colegio',
      );
    }

    const currentSchool = await this.schoolRepository.findById(request.id);
    if (!currentSchool) {
      throw new Error('Colegio no encontrado');
    }

    let imgUrl = currentSchool.imgUrl;
    if (file) {
      // Si hay imagen previa, la borramos de S3
      if (imgUrl) {
        await this.s3Service.deleteFile(imgUrl);
      }
      imgUrl = await this.s3Service.uploadFile(file);
    }

    const school = new School(
      currentSchool.id,
      request.name ?? currentSchool.name,
      request.codeDANE ?? currentSchool.codeDANE,
      request.address ?? currentSchool.address,
      request.phone ?? currentSchool.phone,
      imgUrl,
      request.department ?? currentSchool.department,
      request.municipality ?? currentSchool.municipality,
      request.mail ?? currentSchool.mail,
      request.website ?? currentSchool.website,
      currentSchool.activate,
      currentSchool.createdAt,
      new Date(),
    );

    const savedSchool = await this.schoolRepository.updateSchool(
      school,
      request.id,
    );
    return {
      school: {
        id: savedSchool.id,
        name: savedSchool.name ?? '',
        codeDANE: savedSchool.codeDANE ?? '',
        address: savedSchool.address ?? '',
        phone: savedSchool.phone ?? '',
        imgUrl: savedSchool.imgUrl ?? '',
        department: savedSchool.department ?? '',
        municipality: savedSchool.municipality ?? '',
        mail: savedSchool.mail ?? '',
        website: savedSchool.website ?? '',
        sedes: savedSchool.sedes || [],
      },
    };
  }
}
