import { Controller, Get, Post, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { FsCredsService } from './auth/fs-creds.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { fscreds } from './entity/freeswitch.entity';
import { ApiCredential } from './models/apiCredential.model';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    let result = this.authService.login(req.user);
    console.log('test auth');
    console.log('creds -', result);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req){
    return req.user;
  }

  @Get('fs')
  getHello(): string {
    // return this.appService.getHello();
    return 'Hello World';
  }

  // @Get('fs')
  // async getfs(): Promise<fscreds>{
  //   // await this.fsService.addVehicle();

  //   // return this.fsService.getOne('freeswitch', 'machaik-fs2021');
  //   return this.authService.getOneById(1);
  // }

  // @Get('validateApi')
  // async validateApi(apiKey: string, apiPassword: string){
  //   return this.authService.validateApiCredential(apiKey, apiPassword);
  // }
}
