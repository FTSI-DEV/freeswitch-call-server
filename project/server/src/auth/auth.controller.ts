import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
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

@Controller('auth')
export class AuthController {
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
