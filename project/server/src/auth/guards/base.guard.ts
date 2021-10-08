import { CanActivate, ExecutionContext, Inject, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import * as jwt from 'jsonwebtoken';
import { AuthService } from "../auth.service";
import { UserBlacklistedTokenValidator } from "../validator/user-blacklisted-token.validator";
const APP_SECRET = '0dd8d1d7c673300e0e800e10e13eb6ee1414c140e046ebf7e2229010ab7ab79a10f06fddeebabfb428b6a380aa12654c';

export class BaseGuard implements CanActivate{

    private readonly userBlacklistedTokenValidator = new UserBlacklistedTokenValidator();

    constructor
    (
        protected readonly reflector: Reflector,
        @Inject('AUTH_SERVICE')
        readonly authService: AuthService
    ){}

    async canActivate(context: ExecutionContext){

        let request: Request = context.switchToHttp().getRequest();

        let authHeaders = request.headers.authorization;

        let body = request.body;

        console.log('BaseGuard:authHeaders -> ', authHeaders);

        console.log('BaseGuard:body -> ', body);

        if (authHeaders && (authHeaders as string).split(' ')[1]){

            let token = (authHeaders as string).split(' ')[1];

            let decoded : any = jwt.verify(token, APP_SECRET);

            this.userBlacklistedTokenValidator.validate({
                token: token,
                exp: decoded.exp
            });

            console.log('BaseGuard:decoded -> ', decoded);

            let user = await this.authService.verifyUserPayload(decoded);

            console.log('BaseGuard:user -> ', user);

            if (!user){
                return false;
            }

            return true;
        }

        return false;
    }

}