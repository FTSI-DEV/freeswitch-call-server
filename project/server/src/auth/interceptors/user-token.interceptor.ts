import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { AccountCredentialModel } from "src/modules/account-config/models/accountConfigDto.model";
import { AuthService } from "../auth.service";
import type { Response } from 'express';
import { UserCredentialModel } from "src/modules/users/models/user-creds.model";

@Injectable()
export class UserTokenInterceptor implements NestInterceptor{
    constructor(
        private readonly authService: AuthService
    ) {
    }

    intercept(
        context: ExecutionContext, 
        next: CallHandler<UserCredentialModel>): Observable<UserCredentialModel> | Promise<Observable<UserCredentialModel>> {

        return next.handle().pipe(
            map((user) => {
                
                const response = context.switchToHttp().getResponse<Response>();

                let token = this.authService.signUserToken(user);

                response.setHeader('Authorization', `Bearer ${token}`);

                response.cookie('token', token, {
                    httpOnly: true,
                    signed: true,
                    sameSite: 'strict',
                    secure: process.env.NODE_ENV === 'production'
                });

                return user;
            }),
        );
        
    }
}