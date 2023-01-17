import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ActivateUserDto, LoginDto, RequestResetPasswordDto } from './dtos';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Get('activate-account')
  activateAccount(@Query() activateUserDto: ActivateUserDto): Promise<void> {
    return this.authService.activateUser(activateUserDto);
  }

  @Patch('request-reset-password')
  requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<void> {
    return this.authService.requestResetPassword(requestResetPasswordDto);
  }
}
