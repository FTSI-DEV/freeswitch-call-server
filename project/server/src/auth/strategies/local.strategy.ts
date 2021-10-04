import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'accountSID',
      passwordField: 'authKey',
      passReqToCallback: false
    })
  }

  async validate(accountSID: string, authKey: string, user?:any): Promise<any> {
    
    let account = this.authService.signToken(user);

    if (!account){
      throw new UnauthorizedException();
    }

    return account;
  }
}
