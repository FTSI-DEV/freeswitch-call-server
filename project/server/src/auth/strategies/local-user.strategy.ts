import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from 'src/entity/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(Strategy, 'localUser') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'Username',
      passwordField: "Password",
      passReqToCallback: false,
    });
  }

  validate(Username: string, Password: string): Promise<UserEntity> {
    console.log('LocalStrategy:validate -> ', Username);
    return this.authService.login(Username, Password);
  }
}
