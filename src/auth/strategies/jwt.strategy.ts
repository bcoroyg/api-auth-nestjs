import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from 'src/config';
import { UserEntity } from 'src/users/entities';
import { UsersRepository } from 'src/users/repositories';
import { IJwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //metodo de extracción de token
      ignoreExpiration: false, // validación de token expirado
      secretOrKey: config.get<string>(JWT_SECRET), // llave secreta
    });
  }

  async validate(payload: IJwtPayload): Promise<UserEntity> {
    const { email } = payload;
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
