import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccountLocalAuthGuard extends AuthGuard('localAccount') {
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const result = (await super.canActivate(context)) as boolean;

    console.log('AccountLocalAuthGuard:result -> ', result);
    
    return result;
  }
}
