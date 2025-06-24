import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/domain/services/email.service';

interface BrevoEmailRequest {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
    name?: string;
  }>;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

@Injectable()
export class BrevoEmailService implements EmailService {
  private readonly apiUrl = 'https://api.brevo.com/v3/smtp/email';
  private readonly apiKey: string;
  private readonly senderName: string;
  private readonly senderEmail: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('BREVO_API_KEY')!;
    this.senderName =
      this.configService.get<string>('BREVO_SENDER_NAME') || 'Your App';
    this.senderEmail = this.configService.get<string>('BREVO_SENDER_EMAIL')!;

    if (!this.apiKey) {
      throw new Error('BREVO_API_KEY is required');
    }
    if (!this.senderEmail) {
      throw new Error('BREVO_SENDER_EMAIL is required');
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}reset-password?token=${token}`;

    const emailData: BrevoEmailRequest = {
      sender: {
        name: this.senderName,
        email: this.senderEmail,
      },
      to: [
        {
          email: email,
        },
      ],
      subject: 'Password Reset Request',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6c757d; }
            .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .button:hover { background-color: #0056b3; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; color: #007bff;">Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You requested a password reset for your account. Click the button below to reset your password:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <div class="warning">
                <strong>Important:</strong> This link will expire in 1 hour for security reasons.
              </div>
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
              <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>This email was sent by ${this.senderName}. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `
        Password Reset Request
        
        You requested a password reset for your account.
        
        Click this link to reset your password: ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email.
      `,
    };

    await this.sendEmail(emailData);
  }

  async sendEmailVerification(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    const emailData: BrevoEmailRequest = {
      sender: {
        name: this.senderName,
        email: this.senderEmail,
      },
      to: [
        {
          email: email,
        },
      ],
      subject: 'Please Verify Your Email Address',
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6c757d; }
            .button { display: inline-block; padding: 12px 24px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .button:hover { background-color: #1e7e34; }
            .welcome { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; color: #28a745;">Welcome to ${this.senderName}!</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for creating an account with us! To complete your registration, please verify your email address by clicking the button below:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </p>
              <div class="welcome">
                <strong>Almost there!</strong> Once you verify your email, you'll have full access to all features.
              </div>
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px;">
                ${verificationUrl}
              </p>
              <p>If you didn't create an account with us, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>This email was sent by ${this.senderName}. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      textContent: `
        Welcome to ${this.senderName}!
        
        Thank you for creating an account with us!
        
        Please verify your email address by clicking this link: ${verificationUrl}
        
        If you didn't create an account, please ignore this email.
      `,
    };

    await this.sendEmail(emailData);
  }

  private async sendEmail(emailData: BrevoEmailRequest): Promise<void> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorData: unknown = await response.json().catch(() => ({}));
        throw new Error(
          `Brevo API error: ${response.status} - ${JSON.stringify(errorData)}`,
        );
      }

      const result: unknown = await response.json();
      console.log(
        'Email sent successfully:',
        (result as { messageId?: string }).messageId,
      );
    } catch (error) {
      console.error('Failed to send email via Brevo:', error);
      throw new Error(`Failed to send email: ${String(error)}`);
    }
  }
}
