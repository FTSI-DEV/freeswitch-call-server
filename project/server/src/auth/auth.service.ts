import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountConfigEntity, AccountConfigEntityRepository } from 'src/entity/account-config.entity';
import { UserEntity } from 'src/entity/user.entity';
import { AccountCredentialModel } from 'src/modules/account-config/models/accountConfigDto.model';
import { ACCOUNT_CONFIG_SERVICE, IAccountConfigService } from 'src/modules/account-config/services/account-config.interface';
import { IUserService, USER_SERVICE } from 'src/modules/users/services/users.interface';
import { UsersService } from 'src/modules/users/services/users.service';
import { ReturningStatementNotSupportedError } from 'typeorm';
import { SignUp } from './dto/sign-up.dto';
// import { SignUp } from './dto/sign-up.dto';

import { JwtPayload } from './interfaces/jwt-payload.interface';

export const AUTH_SERVICE = 'AUTH_SERVICE';

export interface IAuthService {
  
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly usersService: IUserService,

    private readonly jwtService: JwtService,
    
    @InjectRepository(AccountConfigEntityRepository)
    private _accountConfigRepo: AccountConfigEntityRepository
  ) {}

  async register(signUp: SignUp): Promise<UserEntity> {

    console.log('Register');
    
    const user = await this.usersService.create(signUp);

    delete user.Password;

    return user;
  }

  async login(Username: string, password: string): Promise<UserEntity> {
    let user: UserEntity;

    try {
      user = await this.usersService.findOne({ where: { Username } });
      console.log('AuthService:login -> ', user);
    } catch (err) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${Username}`,
      );
    }

    if (!(await user.checkPassword(password))) {
      throw new UnauthorizedException(
        `Wrong password for user with email: ${Username}`,
      );
    }
    delete user.Password;

    return user;
  }

  async verifyUserPayload(payload: JwtPayload): Promise<UserEntity> {
    let user: UserEntity;

    console.log('AuthService:payload -> ', payload);

    try {
      user = await this.usersService.findOne({ where: { Username: payload.sub } });
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with username: ${payload.sub}`,
      );
    }

    if (user)
      delete user.Password;

    return user;
  }

  async verifyAccountPayload(payload: JwtPayload): Promise<AccountConfigEntity> {
    let account: AccountConfigEntity;

    console.log('AuthService:verifyAccountPayload -> ', payload);

    try {
      account = await this._accountConfigRepo.findOne({ where: { AuthKey: payload.sub } });

      console.log('AuthService:verifyaccountpayload: account -> ', account);

    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any account with accountSID: ${payload.sub}`,
      );
    }

    return account;
  }

  signUserToken(user: UserEntity): string {
    const payload = {
      sub: user.Username,
    };

    console.log('AuthService:signToken -> ', this.signUserToken);

    let sign =  this.jwtService.sign(payload);

    console.log('AuthService:sign -> ', sign)

    return sign;
  }

  signAccountCredsToken(account:AccountCredentialModel){

    let payload = {
      accountSID: account.AccountSID,
      sub: account.AuthKey
    };

    // return{
    //   access_token: this.jwtService.sign(payload)
    // };

    return this.jwtService.sign(payload);
  }

  async validateAccount(accountSID:string, authKey:string):Promise<AccountCredentialModel>{

    let account = await this._accountConfigRepo.createQueryBuilder("AccountConfig")
        .where("AccountConfig.AccountSID = :accountSID", { accountSID : accountSID })
        .getOne();

    // let account:any;

    if (account &&
        account.AuthKey === authKey){

      let accountCreds : AccountCredentialModel = {
        AccountSID: account.AccountSID,
        AuthKey: account.AuthKey
      };

      let { AuthKey: authKey, ...result } = accountCreds;
      
      // return {
      //   Id: account.Id,
      //   AccountName: account.AccountName,
      //   AccountSID: account.AccountSID,
      //   AuthKey: account.AuthKey,
      //   IsActive: account.IsActive,
      //   DateCreated : account.DateCreated,
      //   DateUpdated : account.DateCreated
      // };

      return accountCreds;
    }

    return null;
  }
}
