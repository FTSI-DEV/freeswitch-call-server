import { BadRequestException, CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { AuthService } from "../auth.service";
import { BaseGuard } from "./base.guard";
import * as jwt from 'jsonwebtoken';
import { chownSync } from "fs";
const APP_SECRET = '0dd8d1d7c673300e0e800e10e13eb6ee1414c140e046ebf7e2229010ab7ab79a10f06fddeebabfb428b6a380aa12654c';


export class AccountGuard extends BaseGuard implements CanActivate{

    constructor(
        protected readonly reflector: Reflector,
        @Inject('AUTH_SERVICE')
        authService : AuthService
    ){
        super(reflector, authService);
    }

    async canActivate(context:ExecutionContext){

        let request: Request = context.switchToHttp().getRequest();

        let authHeaders = request.headers.authorization;

        let body = request.body;

        console.log('AccountGuard:authHeaders -> ', authHeaders);

        console.log('AccountGuard:body -> ', body);

        if (authHeaders && (authHeaders as string).split(' ')[1]){

            try
            {
                let token = (authHeaders as string).split(' ')[1];

                let decoded: any = jwt.verify(token, APP_SECRET);
    
                console.log("AccountGuard:decoded -> ", decoded);
    
                let account = await this.authService.verifyAccountPayload(decoded);
    
                console.log('AccountGuard:account -> ', account );
    
                if (!account){
                    return await super.canActivate(context);
                }
    
                request.user = account;
                
                return true;
            }
            catch(err){
                throw new BadRequestException(err);
            }
        }
        
        return await super.canActivate(context);
    }
}