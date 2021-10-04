import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiCredential } from 'src/models/apiCredential.model';
import { configService } from 'src/config/config.service';
import { ACCOUNT_CONFIG_SERVICE, IAccountConfigService } from 'src/modules/account-config/services/account-config.interface';
import { AccountConfigEntity } from 'src/entity/account-config';
import { AccountConfigDTO, AccountCredentialModel } from 'src/modules/account-config/models/accountConfigDto.model';

@Injectable()
export class AuthService {
  constructor(
      private jwtService: JwtService,
      @Inject(ACCOUNT_CONFIG_SERVICE)
      private accountConfigService : IAccountConfigService
      ) {}

    async validateAccount(accountSID:string, authKey:string):Promise<AccountCredentialModel>{

      let account = await this.accountConfigService.getByAccountSID(accountSID);

      if (account &&
          account.authKey === authKey){

        let accountCreds : AccountCredentialModel = {
          accountSID: account.accountSID,
          authKey: account.authKey
        };

        let { authKey, ...result } = accountCreds;
        return accountCreds;
      }

      return null;
    }

    async signToken(account:AccountCredentialModel){

      let payload = {
        accountSID: account.accountSID,
        sub: account.authKey
      };

      return{
        access_token: this.jwtService.sign(payload)
      };
    }

}
