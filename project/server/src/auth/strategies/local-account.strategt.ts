import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AccountConfigEntity } from 'src/entity/account-config.entity';
import { UserEntity } from 'src/entity/user.entity';
import { AccountCredentialModel } from 'src/modules/account-config/models/accountConfigDto.model';

import { AuthService, AUTH_SERVICE } from '../auth.service';

@Injectable()
export class LocalAccountStrategy extends PassportStrategy(Strategy, 'localAccount') {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthService) {
    super({
      usernameField: 'AccountSID',
      passwordField: 'AuthKey',
      passReqToCallback: false,
    });
  }

  async validate(AccountSID: string, AuthKey: string): Promise<AccountCredentialModel> {
    console.log('LocalAccountStrategy:AccountSID -> ', AccountSID);
    console.log('LocalAccountStrategy:AuthToken -> ', AuthKey);
    let result =  await this.authService.validateAccount(AccountSID, AuthKey);
    return result;
  }
}
