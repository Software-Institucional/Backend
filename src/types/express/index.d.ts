import type { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}
