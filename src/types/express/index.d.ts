import type { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

interface RequestWithCookies extends Request {
  cookies: {
    refreshToken?: string;
    accessToken?: string;
  };
}
