import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EncoderService, UsersService } from 'src/users/services';
import { LoginDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly encoderService: EncoderService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user = await this.usersService.getUserByEmail(email);
    if (
      user &&
      (await this.encoderService.validatePassword(password, user.password))
    ) {
      return 'jwt';
    }

    throw new UnauthorizedException('Please check your credentials');
  }
}
