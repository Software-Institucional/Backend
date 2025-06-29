import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  AllUserResponseDto,
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  LogoutResponseDto,
  RefreshTokenResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
  AllUserRequestDto,
  AllUsersBySchoolResponseDto,
  UpdateUserRequestDto,
  UpdateUserResponseDto,
} from 'src/application/dtos/user.dtos';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/infrastructure/guards/jwt.auth.guard';
import { JwtPayload } from 'src/domain/interfaces/jwt-payload.interface';
import { RequestWithCookies } from 'src/types/express';
import { ForgotPasswordUseCase } from 'src/application/use-case/auth/forgot-password.use-case';
import { LoginUseCase } from 'src/application/use-case/auth/login.use-case';
import { LogoutUseCase } from 'src/application/use-case/auth/logout.use-case';
import { RefreshTokenUseCase } from 'src/application/use-case/auth/refresh-token.use-case';
import { RegisterUseCase } from 'src/application/use-case/auth/register.use-case';
import { ResetPasswordUseCase } from 'src/application/use-case/auth/reset-password.use-case';
import { AllUSerUseCase } from 'src/application/use-case/auth/all-user-register.use-case';
import { UpdateUserUseCase } from 'src/application/use-case/auth/update-user.use-case';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly allUserUseCase: AllUSerUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  private getCookieConfig(req: Request) {
    const origin = req.headers.origin || '';
    const allowedOrigins = [
      'https://www.eduadminsoft.shop',
      'https://eduadminsoft.shop',
    ];
    const isProduction = allowedOrigins.includes(origin);

    return {
      secure: true, // Requerido para SameSite=None
      sameSite: 'none' as const, // Requerido para cross-site
      domain: isProduction ? '.eduadminsoft.shop' : undefined,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({
    status: 200,
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() request: RegisterRequestDto) {
    return this.registerUseCase.execute(request);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() request: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const result = await this.loginUseCase.execute(request);
    const cookieConfig = this.getCookieConfig(req);

    // Configuración de cookies para refreshToken
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      maxAge: 35 * 24 * 60 * 60 * 1000, // 7 días
      path: '/',
      domain: cookieConfig.domain,
    });

    // Configuración de cookies para accessToken
    res.cookie('accessToken', result.accessToken, {
      httpOnly: false,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      maxAge: 35 * 60 * 1000, // 35 minutos
      path: '/',
      domain: cookieConfig.domain,
    });

    return result;
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookies');
    }

    const result = await this.refreshTokenUseCase.execute({
      refreshToken,
    });

    const cookieConfig = this.getCookieConfig(req);

    // Configuración de cookies para refreshToken
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: '/',
      maxAge: 35 * 24 * 60 * 60 * 1000, // 7 días
      domain: cookieConfig.domain,
    });

    // Configuración de cookies para accessToken
    res.cookie('accessToken', result.accessToken, {
      httpOnly: false,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: '/',
      domain: cookieConfig.domain,
      maxAge: 35 * 60 * 1000, // 35 minutos
    });

    return result;
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent',
    type: ForgotPasswordResponseDto,
  })
  async forgotPassword(@Body() request: ForgotPasswordRequestDto) {
    return this.forgotPasswordUseCase.execute(request);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
    type: ResetPasswordResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() request: ResetPasswordRequestDto) {
    return this.resetPasswordUseCase.execute(request);
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    type: LogoutResponseDto,
  })
  async logout(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponseDto> {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Invalida el token en la base de datos
      await this.logoutUseCase.execute({ refreshToken });
    }

    const cookieConfig = this.getCookieConfig(req);

    // Limpia las cookies del navegador
    res.clearCookie('accessToken', {
      httpOnly: false,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: '/',
      domain: cookieConfig.domain,
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: '/',
      domain: cookieConfig.domain,
    });

    return { message: 'Logged out successfully' };
  }

  @Get('view-registered')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'View users registered by the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of registered users',
    type: AllUserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async view(
    @Req() req: Request & { user: JwtPayload },
    @Query() query: AllUserRequestDto,
  ): Promise<AllUserResponseDto | AllUsersBySchoolResponseDto> {
    return this.allUserUseCase.allUser({ user: req.user, ...query });
  }

  @Put('update-user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user data' })
  @ApiBody({ type: UpdateUserRequestDto })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UpdateUserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Body() request: UpdateUserRequestDto,
    @Req() req: Request & { user: JwtPayload },
  ): Promise<UpdateUserResponseDto> {
    return this.updateUserUseCase.execute({
      ...request,
      user: req.user,
    });
  }
}
