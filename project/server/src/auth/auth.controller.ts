import { Controller, Post, UseGuards, Request, Get, UnauthorizedException, HttpCode, HttpStatus, UseInterceptors } from "@nestjs/common";
import { AuthAccount } from "src/modules/account-config/account-config.decorator";
import { AccountConfigDTO, AccountCredentialModel } from "src/modules/account-config/models/accountConfigDto.model";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { TokenInterceptor } from "./interceptors/token.interceptor";

@Controller('auth')
export class AuthenticationController{
    constructor(
        private authService: AuthService
    ) {}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(TokenInterceptor)
    async login(@AuthAccount() account: AccountCredentialModel): Promise<AccountCredentialModel>{
        return account;
    }

    @Post('/account')
    @UseGuards(JwtAuthGuard)
    account(@AuthAccount() account: AccountCredentialModel):AccountCredentialModel{
        return account;
    }
}