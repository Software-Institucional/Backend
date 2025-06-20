import { JwtPayload } from '../interfaces/jwt-payload.interface';

export interface JwtService {
  generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string;
  generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string;
  verifyAccessToken(token: string): JwtPayload;
  verifyRefreshToken(token: string): JwtPayload;
}
