import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class RefreshTokenCleanupJob {
  private readonly logger = new Logger(RefreshTokenCleanupJob.name);

  constructor(private readonly prisma: PrismaService) {}

  // Corre cada día a las 3AM
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCleanup() {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { isRevoked: true }],
      },
    });
    this.logger.log(`RefreshTokenCleanup: deleted ${result.count} tokens`);
  }
}
