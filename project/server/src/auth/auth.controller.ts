import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { response, Response } from 'express';
import { UserEntity } from 'src/entity/user.entity';
import { AuthAccount } from 'src/modules/account-config/account-config.decorator';
import { AccountCredentialModel } from 'src/modules/account-config/models/accountConfigDto.model';
import { AuthUser } from 'src/modules/users/user.decorator';
import { AuthService } from './auth.service';
import { SignUp } from './dto/sign-up.dto';
// import { SignUp } from './dto/sign-up.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { AccountTokenInterceptor } from './interceptors/account-token.interceptor';
import { UserTokenInterceptor } from './interceptors/user-token.interceptor';
import { UserBlacklistedTokenValidator } from './validator/user-blacklisted-token.validator';
import * as jwt from 'jsonwebtoken';
import { PhoneNumberConfigParam } from 'src/modules/phonenumber-config/models/phoneNumberConfig.model';
import { JsonDataListReturnModel } from 'src/utils/jsonDataListReturnModel';

@Controller('auth')
export class AuthController {

  private readonly userBlacklistToken = new UserBlacklistedTokenValidator();

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(UserTokenInterceptor)
  register(@Body() signUp: SignUp): Promise<UserEntity> {
    console.log('AuthenticationController:register -> ', signUp);
    return this.authService.register(signUp);
  }

  @Post('loginUser')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(UserTokenInterceptor)
  async loginUser(@AuthUser() user: UserEntity): Promise<UserEntity> {
    console.log('AuthController:user -> ', user);
    return user;
  }

  @Get('/me')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  me(@AuthUser() user: UserEntity): UserEntity {
    return user;
  }

  @Post('logoutUser')
  async logoutUser(@Request() req){

    console.log('Request:Token -> ', req.signedCookies.token);

    console.log('Request:Secret -> ', req.secret);

    // var token = req.signedCookies.token;

    var secret = req.secret;

    var authHeaders = req.headers.authorization;

    if (authHeaders && (authHeaders as string).split(' ')[1]){
      let token = (authHeaders as string).split(' ')[1];
      let decoded:any = jwt.verify(token, secret);

      console.log('token -> ' , token);
      console.log('decoded -> ', decoded);

        this.userBlacklistToken.addToBlacklist({
          token: token,
          exp: decoded.exp
        });
    }

    return{
      message: 'logged out'
    }
  }

  @Post('loginAccount')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(AccountTokenInterceptor)
    async loginAccount(@AuthAccount() account: AccountCredentialModel): Promise<AccountCredentialModel>{
        return account;
    }

    @Post('/account')
    @UseGuards(JwtAuthGuard)
    account(@AuthAccount() account: AccountCredentialModel):AccountCredentialModel{
        return account;
    }
}
