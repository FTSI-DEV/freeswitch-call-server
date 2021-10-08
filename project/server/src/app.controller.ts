import { Controller, Get, Post, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { UserJwtAuthGuard } from './auth/guards/user-jwt-auth.guard';
import { UserLocalAuthGuard } from './auth/guards/user-local-auth.guard';
import { ApiCredential } from './models/apiCredential.model';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService) {}

  // @UseGuards(LocalAuthGuard)
  // @Post('auth/login')
  // async login(@Request() req) {
  //   console.log('UAHT- > ', req.user);
  //   let res = this.authService.signAccountCredsToken(req.user);
  //   return res;
  //   // let result = this.authService.login(req.user);
  //   // return result;
  // }

  @UseGuards(UserJwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req){
    console.log('test -> ' , req);
    return 'Ok!';
  }

  @Get('fs')
  getHello(): string {
    return this.appService.getHello();
    return 'Hello World';
  }
}
