import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserEntity } from 'src/entity/user.entity';

import { AuthService } from '../auth.service';
import { UserBlacklistedTokenValidator } from '../validator/user-blacklisted-token.validator';

@Injectable()
export class UserTokenInterceptor implements NestInterceptor {

  private readonly userTokenValidator = new UserBlacklistedTokenValidator();

  constructor(
    private readonly authService: AuthService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<UserEntity>,
  ): Observable<UserEntity> {
    return next.handle().pipe(
      map((user) => {
        const response = context.switchToHttp().getResponse<Response>();

        console.log('TokenInterceptor:user -> ', user);

        const token = this.authService.signUserToken(user);

        this.userTokenValidator.validate({
          token : token
        });

        console.log('TokenInterceptor:Token -> ', token);

        response.setHeader('Authorization', `Bearer ${token}`);

        response.cookie('token', token, {
          httpOnly: true,
          signed: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
        });

        return user;
      }),
    );
  }
}
