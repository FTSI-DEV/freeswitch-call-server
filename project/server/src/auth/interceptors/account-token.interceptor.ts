import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { AccountCredentialModel } from "src/modules/account-config/models/accountConfigDto.model";
import { AuthService } from "../auth.service";
import type { Response } from 'express';
import { AccountConfigEntity } from "src/entity/account-config.entity";

@Injectable()
export class AccountTokenInterceptor implements NestInterceptor{
    constructor(
        private readonly authService: AuthService
    ) { }

    intercept(
        context: ExecutionContext, 
        next: CallHandler<AccountConfigEntity>): Observable<AccountConfigEntity> | Promise<Observable<AccountConfigEntity>> {

        return next.handle().pipe(
            map((account) => {

                console.log('UserTokenInterceptor:account -> ' , account);
                
                const response = context.switchToHttp().getResponse<Response>();

                console.log('AccountTokenInterceptor:intercept -> ', account);

                let token = this.authService.signAccountCredsToken({
                    AuthToken: account.AuthToken,
                    AccountSID : account.AccountSID
                });

                console.log('AccountTokenInterceptor:token -> ', token);

                response.setHeader('Authorization', `Bearer ${token}`);

                response.cookie('token', token, {
                    httpOnly: true,
                    signed: true,
                    sameSite: 'strict',
                    secure: process.env.NODE_ENV === 'production'
                });

                return account;
            }),
        );
        
    }
}