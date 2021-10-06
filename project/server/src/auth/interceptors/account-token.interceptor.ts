import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { AccountCredentialModel } from "src/modules/account-config/models/accountConfigDto.model";
import { AuthService } from "../auth.service";
import type { Response } from 'express';

@Injectable()
export class AccountTokenInterceptor implements NestInterceptor{
    constructor(
        private readonly authService: AuthService
    ) { }

    intercept(
        context: ExecutionContext, 
        next: CallHandler<AccountCredentialModel>): Observable<AccountCredentialModel> | Promise<Observable<AccountCredentialModel>> {

        return next.handle().pipe(
            map((account) => {
                
                const response = context.switchToHttp().getResponse<Response>();

                let token = this.authService.signAccountCredsToken(account);

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