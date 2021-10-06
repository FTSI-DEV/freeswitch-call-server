import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalAccountStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'accountSID',
      passwordField: 'authKey',
      passReqToCallback: false
    })
  }

  // async validate(accountSID: string, authKey: string, user?:any): Promise<any> {
    
  //   let account = this.authService.signAccountCredsToken(user);

  //   if (!account){
  //     throw new UnauthorizedException();
  //   }

  //   return account;
  // }


  async validate(accountSID:string, authKey:string):Promise<any>{

    try {
      let account = this.authService.signAccountCredsToken({
        accountSID: accountSID,
        authKey: authKey
      });
  
      if (!account){
        throw new UnauthorizedException();
      }
  
      return account;
    } catch (error) {
      console.log('LocalAccountStrategy -> ', error);
    }
    
  }
}
