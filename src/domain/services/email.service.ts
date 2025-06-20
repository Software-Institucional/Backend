export interface EmailService {
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
  sendEmailVerification(email: string, token: string): Promise<void>;
}
