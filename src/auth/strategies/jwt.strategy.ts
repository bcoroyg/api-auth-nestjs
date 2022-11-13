import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from 'src/config';
import { UsersService } from 'src/users/services';
import { IJwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //metodo de extracción de token
      ignoreExpiration: false, // validación de token expirado
      secretOrKey: config.get<string>(JWT_SECRET), // llave secreta
    });
  }

  async validate(payload: IJwtPayload) {
    console.log(payload);
    const { email, id } = payload;
    //return { id };

    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
