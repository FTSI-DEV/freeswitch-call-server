import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { FsCredsService } from './auth/fs-creds.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { fscreds } from './entity/freeswitch.entity';

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

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('fs')
  async getfs(): Promise<fscreds>{
    // await this.fsService.addVehicle();

    // return this.fsService.getOne('freeswitch', 'machaik-fs2021');
    return this.authService.getOneById(1);
  }
}
