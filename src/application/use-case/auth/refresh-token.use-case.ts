import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshToken } from 'src/domain/entities/auth/refresh-token.entity';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';
import { RefreshTokenRepository } from 'src/domain/repositories/refresh-token.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from 'src/application/dtos/user.dtos';
import { NestJsJwtService } from 'src/infrastructure/services/nest-jwt.service';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('JwtService') private readonly jwtService: NestJsJwtService,
  ) {}

  async execute(
    request: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    // Verify refresh token
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verifyRefreshToken(request.refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Find refresh token in database
    const refreshToken = await this.refreshTokenRepository.findByToken(
      request.refreshToken,
    );
    if (!refreshToken || !refreshToken.isValid()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Find user
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Revoke old refresh token
    const revokedToken = refreshToken.revoke();
    await this.refreshTokenRepository.update(revokedToken);

    // Generate new tokens
    const newPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.generateAccessToken(newPayload);
    const newRefreshTokenValue =
      this.jwtService.generateRefreshToken(newPayload);

    // Save new refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const newRefreshToken = RefreshToken.create(
      user.id,
      user.role,
      newRefreshTokenValue,
      expiresAt,
    );
    await this.refreshTokenRepository.save(newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshTokenValue,
    };
  }
}
