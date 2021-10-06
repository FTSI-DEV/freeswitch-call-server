import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt"){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "m@(h@ikfr33$witch"
        });
    }

    async validate(payload: any){
        console.log('JwtStrategy:validate:payload -> ', payload);
        return {
            userId: payload.sub,
            username: payload.username
        };
    }
}