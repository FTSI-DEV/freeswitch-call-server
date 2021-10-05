import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AccountCredentialModel } from "./models/accountConfigDto.model";
import { Request } from 'express';

export const AuthAccount = createParamDecorator(
    (data: keyof AccountCredentialModel, 
    ctx: ExecutionContext) => {

        const account = ctx.switchToHttp().getRequest<Request>().user as AccountCredentialModel;

        return data ? account && account[data] : account;
    }
);