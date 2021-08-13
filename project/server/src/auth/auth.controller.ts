import { Controller, Post, UseGuards, Request, Get, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller('auth')
export class AuthenticationController{
    constructor(
        private authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req){
        let result = this.authService.login(req.user);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req){
        return req.user
    };

    @UseGuards(LocalAuthGuard)
    @Get('validateApi')
    validateApiByReqBody(@Request() req){
        // console.log('paramkey: ', req);

        let requestBody = req.body;

        let result = this.authService.validateApiCredential(requestBody.apiKey, requestBody.apiPassword);
        
        console.log('result validate', result);
        if (result === false){
            return new UnauthorizedException;
        }

        return result;
    }

     @UseGuards(LocalAuthGuard)
     @Get('validateApi')
     validateApi(apiKey: string, apiPassword:string){
         console.log('paramkey: ', apiKey);
         let result = this.authService.validateApiCredential(apiKey, apiPassword);
         
         console.log('result validate', result);
         if (result === false){
             return new UnauthorizedException;
         }
 
         return result;
     }
}