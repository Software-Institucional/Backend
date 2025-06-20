export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly token: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
    public readonly isRevoked: boolean = false,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(userId: string, token: string, expiresAt: Date): RefreshToken {
    return new RefreshToken(crypto.randomUUID(), token, userId, expiresAt);
  }

  revoke(): RefreshToken {
    return new RefreshToken(
      this.id,
      this.token,
      this.userId,
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
