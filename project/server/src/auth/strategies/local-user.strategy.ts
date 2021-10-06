import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<any> {
    
    let user = this.authService.login(username, password);

    if (!user){
      throw new UnauthorizedException();
    }

    return user;
  }
}
