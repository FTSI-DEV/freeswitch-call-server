import { HttpException, HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { UsersService } from "src/modules/users/services/users.service";
import * as jwt from 'jsonwebtoken';
import { UserBlacklistedTokenValidator } from "src/auth/validator/user-blacklisted-token.validator";
import { AuthService } from "src/auth/auth.service";
const APP_SECRET = '0dd8d1d7c673300e0e800e10e13eb6ee1414c140e046ebf7e2229010ab7ab79a10f06fddeebabfb428b6a380aa12654c';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware{

    private readonly userBlacklistedTokenValidator = new UserBlacklistedTokenValidator();

    constructor(
        private readonly authService: AuthService
    ){}

    async use(req:Request, res:Response, next:NextFunction){

        let authHeaders = req.headers.authorization;
        
        console.log('UserAuthMiddleware:authHeaders -> ' , authHeaders);

        if (authHeaders && (authHeaders as string).split(' ')[1]){

            let token = (authHeaders as string).split(' ')[1];

            let decoded: any = jwt.verify(token, APP_SECRET);

            this.userBlacklistedTokenValidator.validate({
                token: token,
                exp: decoded.exp
            });

            let user = await this.authService.verifyUserPayload(decoded);

            if (!user){
                throw new UnauthorizedException();
                // throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
            }

            req.user = user;

            next();
      
        } 
        else {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }
}