import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AccountConfigEntity } from 'src/entity/account-config.entity';
import { UserEntity } from 'src/entity/user.entity';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalAccountStrategy extends PassportStrategy(Strategy, 'localAccount') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'AccountSID',
      passwordField: 'AuthToken',
      passReqToCallback: false,
    });
  }

  async validate(AccountSID: string, AuthToken: string): Promise<AccountConfigEntity> {
    console.log('LocalAccountStrategy:AccountSID -> ', AccountSID);
    console.log('LocalAccountStrategy:AuthToken -> ', AuthToken);
    let result =  await this.authService.validateAccount(AccountSID, AuthToken);
    return result;
  }
}
