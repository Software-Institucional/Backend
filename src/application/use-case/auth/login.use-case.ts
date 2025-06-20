import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import {
  LoginRequestDto,
  LoginResponseDto,
} from 'src/application/dtos/user.dtos';
import { RefreshToken } from 'src/domain/entities/auth/refresh-token.entity';
import { RefreshTokenRepository } from 'src/domain/repositories/auth/refresh-token.repository';
import { UserRepository } from 'src/domain/repositories/auth/user.repository';
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

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new BadRequestException(
        'Por favor verifica tu correo antes de iniciar sesión',
      );
    }

    if (request.schoolId !== user.schoolId) {
      throw new BadRequestException('No tienes acceso a esta Escuela');
    }

    // Generate tokens
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshTokenValue = this.jwtService.generateRefreshToken(payload);

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const refreshToken = RefreshToken.create(
      user.id,
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
        schoolId: user.schoolId,
      },
    };
  }
}
