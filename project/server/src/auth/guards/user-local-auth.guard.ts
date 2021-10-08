import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserLocalAuthGuard extends AuthGuard('localUser') {

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const result = (await super.canActivate(context)) as boolean;

    console.log('UserLocalAuthGuard:result -> ', result);

    return result;
  }
}
