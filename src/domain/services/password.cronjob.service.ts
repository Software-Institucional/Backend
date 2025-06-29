import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class PasswordResetCleanupJob {
  private readonly logger = new Logger(PasswordResetCleanupJob.name);

  constructor(private readonly prisma: PrismaService) {}

  // Corre cada día a las 3AM
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCleanup() {
    const result = await this.prisma.passwordReset.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { isUsed: true }],
      },
    });
    this.logger.log(`PasswordResetCleanup: deleted ${result.count} tokens`);
  }
}
