import { Role } from '@prisma/client';

export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly userId: string,
    public readonly role: Role,
    public readonly expiresAt: Date,
    public readonly isRevoked: boolean = false,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(
    userId: string,
    role: Role,
    token: string,
    expiresAt: Date,
  ): RefreshToken {
    return new RefreshToken(
      crypto.randomUUID(),
      token,
      userId,
      role,
      expiresAt,
    );
  }

  revoke(): RefreshToken {
    return new RefreshToken(
      this.id,
      this.token,
      this.userId,
      this.role,
      this.expiresAt,
      true,
      this.createdAt,
    );
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isRevoked && !this.isExpired();
  }
}
