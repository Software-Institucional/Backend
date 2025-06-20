import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
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
  SearchSchoolRequestDto,
  UpdateSchoolRequestDto,
} from 'src/application/dtos/school.dtos';
import { CreateSchoolUseCase } from 'src/application/use-case/school/create-school.use-case';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt.auth.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SearchSchoolUseCase } from 'src/application/use-case/school/search-school.use-case';
import { UpdateSchoolUseCase } from 'src/application/use-case/school/update-school.use-case';

@ApiTags('Schools')
@Controller('schools')
export class SchoolController {
  constructor(
    private readonly createSchoolUseCase: CreateSchoolUseCase,
    private readonly searchSchoolUseCase: SearchSchoolUseCase,
    private readonly updateSchoolUseCase: UpdateSchoolUseCase,
  ) {}

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

  @Get()
  @ApiBody({
    description: 'Datos para crear un colegio y su imagen',
    type: CreateSchoolRequestDto,
  })
  async searchSchool(
    @Body() searchSchoolRequestDto: SearchSchoolRequestDto,
  ): Promise<CreateSchoolResponseDto[]> {
    return this.searchSchoolUseCase.Search(searchSchoolRequestDto);
  }

  @Patch('update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos para actualizar un colegio y su imagen',
    type: UpdateSchoolRequestDto,
  })
  @UseInterceptors(FileInterceptor('imgUrl'))
  async updateSchool(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Body() updateSchoolDto: UpdateSchoolRequestDto,
    @Req() req: Request,
  ): Promise<CreateSchoolResponseDto> {
    updateSchoolDto.user = req.user as UpdateSchoolRequestDto['user'];
    return this.updateSchoolUseCase.create(updateSchoolDto, file);
  }

  @Get('test-payload')
  @UseGuards(JwtAuthGuard)
  verificarPayload(@Req() req: Request) {
    return req.user;
  }
}
