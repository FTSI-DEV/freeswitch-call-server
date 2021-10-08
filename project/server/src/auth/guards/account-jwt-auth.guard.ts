import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccountJwtAuthGuard extends AuthGuard('jwtAccount') {}
