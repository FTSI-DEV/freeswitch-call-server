import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from 'src/entity/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'Username',
      passwordField: "Password",
      passReqToCallback: false,
    });
  }

  validate(Username: string, Password: string): Promise<UserEntity> {
    return this.authService.login(Username, Password);
  }
}
