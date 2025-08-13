import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import {
  LoginRequestDto,
  LoginResponseDto,
  LoginSuperRequestDto,
} from 'src/application/dtos/user.dtos';
import { RefreshToken } from 'src/domain/entities/auth/refresh-token.entity';
import { RefreshTokenRepository } from 'src/domain/repositories/refresh-token.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { JwtService } from 'src/domain/services/jwt.service';
import { PasswordService } from 'src/domain/services/password.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject('PasswordService')
    private readonly passwordService: PasswordService,
    @Inject('JwtService') private readonly jwtService: JwtService,
  ) {}

  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    // Find user by email
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verify password
    const isPasswordValid = await this.passwordService.compare(
      request.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.activate) {
      throw new BadRequestException('Tu cuenta no está activa.');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new BadRequestException(
        'Por favor verifica tu correo antes de iniciar sesión',
      );
    }

    if (user.role !== 'SUPER' && request.schoolId) {
      if (user.school?.id !== request.schoolId) {
        throw new BadRequestException(
          'No tienes acceso a esta Escuela. Verifica la Institución.',
        );
      }
    }

    // Generate tokens
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshTokenValue = this.jwtService.generateRefreshToken(payload);

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const refreshToken = RefreshToken.create(
      user.id,
      user.role,
      refreshTokenValue,
      expiresAt,
    );
    await this.refreshTokenRepository.save(refreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        activate: user.activate,
        simatuser: user['simatuser'] ?? null,
        simatpass: user['simatpass'] ?? null,
      },
    };
  }

  async SuperExecute(request: LoginSuperRequestDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verify password
    const isPasswordValid = await this.passwordService.compare(
      request.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.activate) {
      throw new BadRequestException('Tu cuenta no está activa.');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new BadRequestException(
        'Por favor verifica tu correo antes de iniciar sesión',
      );
    }

    if (user.role !== 'SUPER') {
      throw new BadRequestException(
        'No tienes permisos para inciar session como SUPER',
      );
    }

    // Generate tokens
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshTokenValue = this.jwtService.generateRefreshToken(payload);

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const refreshToken = RefreshToken.create(
      user.id,
      user.role,
      refreshTokenValue,
      expiresAt,
    );
    await this.refreshTokenRepository.save(refreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        activate: user.activate,
        simatuser: user['simatuser'] ?? null,
        simatpass: user['simatpass'] ?? null,
      },
    };
  }
}
