import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AccountCredentialModel } from "./models/accountConfigDto.model";
import { Request } from 'express';
import { AccountConfigEntity } from "src/entity/account-config.entity";

export const AuthAccount = createParamDecorator(
    (data: keyof AccountConfigEntity, 
    ctx: ExecutionContext) => {

        const account = ctx.switchToHttp().getRequest<Request>().user as AccountCredentialModel;

        console.log('AuthAccount:account -> ', account);

        return data ? account && account[data] : account;
    }
);