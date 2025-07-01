import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
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
  SearchSchoolResponseDto,
  UpdateSchoolRequestDto,
} from 'src/application/dtos/school.dtos';
import { CreateSchoolUseCase } from 'src/application/use-case/school/create-school.use-case';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt.auth.guard';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Search schools' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter schools by name',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results per page',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'A list of schools matching the criteria',
    type: SearchSchoolResponseDto,
  })
  async searchSchool(
    @Query() searchSchoolDto: SearchSchoolRequestDto,
  ): Promise<SearchSchoolResponseDto> {
    const { name, page = 1, limit = 10 } = searchSchoolDto;
    return this.searchSchoolUseCase.Search({
      name,
      page: +page,
      limit: +limit,
    });
  }

  @Patch()
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

  @Get(':id')
  @ApiOperation({ summary: 'Obtener colegio por ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID del colegio' })
  @ApiResponse({
    status: 200,
    description: 'Colegio encontrado',
    type: CreateSchoolResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Colegio no encontrado' })
  async getSchoolById(
    @Param('id') id: string,
  ): Promise<CreateSchoolResponseDto> {
    const school = await this.searchSchoolUseCase.findById(id);
    if (!school) throw new NotFoundException('Colegio no encontrado');
    return {
      school: {
        id: school.id,
        name: school.name,
        address: school.address!,
        phone: school.phone!,
        imgUrl: school.imgUrl!,
        department: school.department!,
        municipality: school.municipality!,
        mail: school.mail!,
        website: school.website!,
        sedes: school.sedes!,
      },
    };
  }
}
