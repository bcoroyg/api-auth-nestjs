import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/entities';
import { UsersRepository } from 'src/users/repositories';
import { EncoderService } from 'src/users/services';
import { ActivateUserDto, LoginDto, RequestResetPasswordDto } from './dtos';
import { IJwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly encoderService: EncoderService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.getUserByEmail(email);

    if (
      user &&
      (await this.encoderService.validatePassword(password, user.password))
    ) {
      const payload: IJwtPayload = { id: user.id, email, active: user.active };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    }
    throw new UnauthorizedException('Please check your credentials');
  }

  async activateUser(activateUserDto: ActivateUserDto): Promise<void> {
    const { id, code } = activateUserDto;
    const user: UserEntity =
      await this.usersRepository.findOneInactiveByIdAndActivationToken(
        id,
        code,
      );

    if (!user) {
      throw new UnprocessableEntityException('This action can not be done');
    }

    this.usersRepository.activateUser(user);
  }

  async requestResetPassword(
    requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<void> {}
}
