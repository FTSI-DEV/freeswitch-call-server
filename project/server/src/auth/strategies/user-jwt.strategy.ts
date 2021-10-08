import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserEntity } from 'src/entity/user.entity';

import { AuthService, AUTH_SERVICE } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserBlacklistedTokenValidator } from '../validator/user-blacklisted-token.validator';

const APP_SECRET = '0dd8d1d7c673300e0e800e10e13eb6ee1414c140e046ebf7e2229010ab7ab79a10f06fddeebabfb428b6a380aa12654c';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'jwtUser') {

  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: APP_SECRET,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  validate(payload): Promise<UserEntity> {
    console.log('LocalStrategy:validate -> ');
    return this.authService.verifyUserPayload(payload);
  }
}
