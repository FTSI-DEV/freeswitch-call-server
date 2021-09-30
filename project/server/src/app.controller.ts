import { Controller, Get, Post, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { ApiCredential } from './models/apiCredential.model';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    console.log('UAHT- > ', req.user);
    let res = this.authService.login(req.user);
    return res;
    // let result = this.authService.login(req.user);
    // return result;
  }

  @UseGuards(JwtAuthGuard)
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
  @Get('validateApi')
  async validateApi(apiKey: string, apiPassword: string){
    return this.authService.validateApiCredential(apiKey, apiPassword);
  }
}
