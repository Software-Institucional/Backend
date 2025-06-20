import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateSchoolRequestDto,
  CreateSchoolResponseDto,
} from 'src/application/dtos/school.dtos';
import { CreateSchoolUseCase } from 'src/application/use-case/school/create-school.use-case';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt.auth.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Schools')
@Controller('schools')
export class SchoolController {
  constructor(private readonly createSchoolUseCase: CreateSchoolUseCase) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos para crear un colegio y su imagen',
    type: CreateSchoolRequestDto,
  })
  @UseInterceptors(FileInterceptor('imgUrl'))
  async createSchool(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createSchoolDto: CreateSchoolRequestDto,
    @Req() req: Request,
  ): Promise<CreateSchoolResponseDto> {
    createSchoolDto.user = req.user as CreateSchoolRequestDto['user'];
    return this.createSchoolUseCase.create(createSchoolDto, file);
  }
}
