import { Controller, Post, UseGuards, Request, Get, UnauthorizedException, HttpCode, HttpStatus, UseInterceptors, Body } from "@nestjs/common";
import { UserEntity } from "src/entity/user.entity";
import { AuthAccount } from "src/modules/account-config/account-config.decorator";
import { AccountConfigDTO, AccountCredentialModel } from "src/modules/account-config/models/accountConfigDto.model";
import { UserCredentialModel } from "src/modules/users/models/user-creds.model";
import { AuthUser } from "src/modules/users/user.decorator";
import { AuthService } from "./auth.service";
import { SignUp } from "./dto/sign-up.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AccountTokenInterceptor } from "./interceptors/account-token.interceptor";
import { UserTokenInterceptor } from "./interceptors/user-token.interceptor";
import { LocalAccountStrategy } from "./strategies/local-account.strategy";
import { LocalUserStrategy } from "./strategies/local-user.strategy";

@Controller('auth')
export class AuthenticationController{
    constructor(
        private authService: AuthService
    ) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(AccountTokenInterceptor)
    register(@Body() signUp: SignUp): Promise<UserEntity>{
        return this.authService.register(signUp);
    }

    @Post('loginAccount')
    @UseGuards(LocalAccountStrategy)
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(AccountTokenInterceptor)
    async loginAccount(@AuthAccount() account: AccountCredentialModel): Promise<AccountCredentialModel>{
        return account;
    }

    @Post('/account')
    @UseGuards(JwtAuthGuard)
    account(@AuthAccount() account: AccountCredentialModel):AccountCredentialModel{
        return account;
    }

    @Post('loginUser')
    @UseGuards(LocalUserStrategy)
    @UseInterceptors(UserTokenInterceptor)
    async loginUser(@AuthUser() user: UserCredentialModel):Promise<UserCredentialModel>{
        return user;
    }

    @Post('/user')
    @UseGuards(JwtAuthGuard)
    user(@AuthUser() user: UserCredentialModel):UserCredentialModel{
        return user;
    }
}