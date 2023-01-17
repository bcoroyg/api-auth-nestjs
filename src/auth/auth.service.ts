import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { UserEntity } from 'src/users/entities';
import { UsersRepository } from 'src/users/repositories';
import { EncoderService } from 'src/users/services';
import {
  ActivateUserDto,
  LoginDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
} from './dtos';
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
    const user: UserEntity = await this.usersRepository.getUserByEmail(email);

    if (await this.encoderService.validatePassword(password, user.password)) {
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
  ): Promise<void> {
    const { email } = requestResetPasswordDto;

    const user: UserEntity = await this.usersRepository.getUserByEmail(email);
    user.resetPasswordToken = v4();
    this.usersRepository.save(user);
    // Send email(e.g. Dispatch an event so MailerModule can send the email)
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { resetPasswordToken, password } = resetPasswordDto;
    const user: UserEntity =
      await this.usersRepository.findOneByResetPasswordToken(
        resetPasswordToken,
      );

    user.password = await this.encoderService.encodePassword(password);
    user.resetPasswordToken = null;
    this.usersRepository.save(user);
  }
}
