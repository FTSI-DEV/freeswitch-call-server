import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiCredential } from 'src/models/apiCredential.model';
import { configService } from 'src/config/config.service';
import { ACCOUNT_CONFIG_SERVICE, IAccountConfigService } from 'src/modules/account-config/services/account-config.interface';
import { AccountConfigEntity } from 'src/entity/account-config.entity';
import { AccountConfigDTO, AccountCredentialModel } from 'src/modules/account-config/models/accountConfigDto.model';
import { SignUp } from './dto/sign-up.dto';
import { UserEntity } from 'src/entity/user.entity';
import { IUserService, USER_SERVICE } from 'src/modules/users/services/users.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from 'src/modules/users/services/users.service';
import { UserCredentialModel } from 'src/modules/users/models/user-creds.model';

@Injectable()
export class AuthService {
  constructor(
      private jwtService: JwtService,
      @Inject(ACCOUNT_CONFIG_SERVICE)
      private accountConfigService : IAccountConfigService,
      @Inject(USER_SERVICE)
      private readonly userService: IUserService
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

    async signAccountCredsToken(account:AccountCredentialModel){

      let payload = {
        accountSID: account.accountSID,
        sub: account.authKey
      };

      return{
        access_token: this.jwtService.sign(payload)
      };
    }

    signUserToken(user: UserEntity){

      let payload = {
        username: user.Username
      };
      
      return{
        access_token: this.jwtService.sign(payload)
      };
    }

    async register(signUp:SignUp):Promise<UserEntity>{

      let user = await this.userService.create(signUp);

      delete user.Password;

      return user;
    }

    async login(username:string, password:string): Promise<UserEntity>{

      let user: UserEntity;

      try{
        user = await this.userService.findOne({ where: username });
      }
      catch(err){
        throw new UnauthorizedException(
          `There isn't any user with username: ${username}`
        );
      }

      if (!(await user.checkPassword(password))){
        throw new UnauthorizedException(
          `Wrong password for user with username: ${username}`
        );
      }

      delete user.Password;

      return user;

    }

    async verifyPayload(payload: JwtPayload):Promise<UserEntity>{

      let user: UserEntity;

      try{
        user = await this.userService.findOne({ where: { Username : payload.sub }});
      }
      catch(err){
        throw new UnauthorizedException(
          `There isn't any user with username: ${payload.sub}`
        );
      }

      delete user.Password;

      return user;
    }
}
