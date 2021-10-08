import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { AccountCredentialModel } from "src/modules/account-config/models/accountConfigDto.model";
import { AuthService, AUTH_SERVICE } from "../auth.service";
import type { Response } from 'express';
import { AccountConfigEntity } from "src/entity/account-config.entity";

@Injectable()
export class AccountTokenInterceptor implements NestInterceptor{
    constructor(
        @Inject(AUTH_SERVICE)
        private readonly authService: AuthService
    ) { }

    intercept(
        context: ExecutionContext, 
        next: CallHandler<AccountCredentialModel>): Observable<AccountCredentialModel> | Promise<Observable<AccountCredentialModel>> {

        return next.handle().pipe(
            map((account) => {

                console.log('UserTokenInterceptor:account -> ' , account);
                
                const response = context.switchToHttp().getResponse<Response>();

                console.log('AccountTokenInterceptor:intercept -> ', account);

                let token = this.authService.signAccountCredsToken(account);

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