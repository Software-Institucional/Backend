import {
  Controller,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt.auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UpdateMyProfileDto,
  MyProfileResponseDto,
} from 'src/application/dtos/user.dtos';
import { Request } from 'express';
import { UpdateMyProfileUseCase } from 'src/application/use-case/auth/update-my-profile.use-case';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly updateMyProfileUseCase: UpdateMyProfileUseCase,
  ) {}

  @Patch('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Actualizar mi perfil',
    type: UpdateMyProfileDto,
  })
  @UseInterceptors(FileInterceptor('imgUrl'))
  @ApiOperation({
    summary: 'Actualizar mi perfil (nombre, apellido, imagen, contraseña)',
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado',
    type: MyProfileResponseDto,
  })
  async updateMyProfile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Body() dto: UpdateMyProfileDto,
    @Req() req: Request & { user: { sub: string } },
  ): Promise<MyProfileResponseDto> {
    const userId = req.user.sub;
    return this.updateMyProfileUseCase.execute(userId, dto, file);
  }
}
