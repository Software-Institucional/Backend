import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from 'src/domain/repositories/auth/refresh-token.repository';
import { RefreshToken } from 'src/domain/entities/auth/refresh-token.entity';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken) return null;

    return new RefreshToken(
      refreshToken.id,
      refreshToken.token,
      refreshToken.userId,
      refreshToken.role as Role,
      refreshToken.expiresAt,
      refreshToken.isRevoked,
      refreshToken.createdAt,
    );
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const refreshTokens = await this.prisma.refreshToken.findMany({
      where: { userId },
    });

    return refreshTokens.map(
      (token) =>
        new RefreshToken(
          token.id,
          token.token,
          token.userId,
          token.role as Role,
          token.expiresAt,
          token.isRevoked,
          token.createdAt,
        ),
    );
  }

  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    // Aquí sí BORRA todos los refresh tokens previos del usuario
    await this.prisma.refreshToken.deleteMany({
      where: { userId: refreshToken.userId },
    });

    const savedToken = await this.prisma.refreshToken.create({
      data: {
        id: refreshToken.id,
        token: refreshToken.token,
        userId: refreshToken.userId,
        role: refreshToken.role,
        expiresAt: refreshToken.expiresAt,
        isRevoked: refreshToken.isRevoked,
        createdAt: refreshToken.createdAt,
      },
    });

    return new RefreshToken(
      savedToken.id,
      savedToken.token,
      savedToken.userId,
      savedToken.role as Role,
      savedToken.expiresAt,
      savedToken.isRevoked,
      savedToken.createdAt,
    );
  }

  async update(refreshToken: RefreshToken): Promise<RefreshToken> {
    const updatedToken = await this.prisma.refreshToken.update({
      where: { id: refreshToken.id },
      data: {
        isRevoked: refreshToken.isRevoked,
      },
    });

    return new RefreshToken(
      updatedToken.id,
      updatedToken.token,
      updatedToken.userId,
      updatedToken.role as Role,
      updatedToken.expiresAt,
      updatedToken.isRevoked,
      updatedToken.createdAt,
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { id },
    });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }
}
