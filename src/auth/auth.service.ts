import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EncoderService, UsersService } from 'src/users/services';
import { LoginDto } from './dtos';
import { IJwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly encoderService: EncoderService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const user = await this.usersService.getUserByEmail(email);
    if (
      user &&
      (await this.encoderService.validatePassword(password, user.password))
    ) {
      const payload: IJwtPayload = {
        id: user.id,
        email: user.email,
        active: user.active,
      };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    }

    throw new UnauthorizedException('Please check your credentials');
  }
}
