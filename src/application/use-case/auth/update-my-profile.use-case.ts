import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { S3Service } from 'src/infrastructure/s3/s3.service';
import { UpdateMyProfileDto } from 'src/application/dtos/user.dtos';
import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';
import { PrismaUserRepository } from 'src/infrastructure/repositories/prisma-user.repository';
import { AuthService } from 'src/infrastructure/services/simat-login.service';

@Injectable()
export class UpdateMyProfileUseCase {
  constructor(
    private readonly userRepository: PrismaUserRepository,
    private readonly s3Service: S3Service,
    private readonly authService: AuthService, // Inyectar el AuthService
  ) {}

  async execute(
    userId: string,
    dto: UpdateMyProfileDto,
    file?: Express.Multer.File,
  ) {
    const AES_SECRET = process.env.AES_SECRET || 'CLAVE-SECRETA-DEMO';
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Preparar password
    let newPassword = user.password;
    if (dto.newPassword) {
      if (!dto.currentPassword)
        throw new BadRequestException('Debes ingresar la contraseña actual');
      const isValid = await bcrypt.compare(dto.currentPassword, user.password);
      if (!isValid)
        throw new UnauthorizedException('Contraseña actual incorrecta');
      newPassword = await bcrypt.hash(dto.newPassword, 10);
    }

    // Imagen
    let imgUrl = user.imgUrl;
    if (file) {
      if (imgUrl) {
        await this.s3Service.deleteFile(imgUrl);
      }
      imgUrl = await this.s3Service.uploadFile(file);
    }

    // Encriptar SIMAT (solo si los envían, pero primero validar con Playwright)
    let simatuser_encrypted = user.simatuser;
    let simatpass_encrypted = user.simatpass;

    if (dto.simatuser && dto.simatpass) {
      // 1. Validar credenciales con AuthService
      const loginDto = {
        simatuser: dto.simatuser,
        simatpass: dto.simatpass,
      };
      const validationResult =
        await this.authService.validateCredentials(loginDto);

      if (!validationResult.success) {
        throw new BadRequestException(
          'Usuario o contraseña de SIMAT inválidos',
        );
      }

      // 2. Encriptar y hashear si la validación es exitosa
      simatuser_encrypted = CryptoJS.AES.encrypt(
        dto.simatuser,
        AES_SECRET,
      ).toString();
      simatpass_encrypted = CryptoJS.AES.encrypt(
        dto.simatpass,
        AES_SECRET,
      ).toString();
    }

    // Usar el método inmutable para obtener NUEVO User
    const userToUpdate = user.withUpdatedData({
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: newPassword,
      imgUrl,
      simatuser: simatuser_encrypted,
      simatpass: simatpass_encrypted,
    });

    const updatedUser = await this.userRepository.updateme(userToUpdate);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      imgUrl: updatedUser.imgUrl,
      role: updatedUser.role,
      simatuser: updatedUser.simatuser ?? null, // sigue siendo cifrado
      simatpass: updatedUser.simatpass ?? null, // hashed (solo para pruebas)
    };
  }
}
