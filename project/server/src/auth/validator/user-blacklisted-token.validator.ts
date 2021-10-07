import { UnauthorizedException } from '@nestjs/common';
import redis from 'redis';

export class UserBlacklistedTokenValidator{

    constructor(

        
    ){}

    validate(blacklistModel:UserBlackListTokenModel){

        let redisClient = redis.createClient(6379);

        redisClient.on('connect', () => {
            console.log('Connected Redis Server!');
        });

        redisClient.get(USER_BLACKLIST_TOKENS, (err, reply) => {

            if (reply){

                let blackListedTokens:UserBlackListTokenModel[] = JSON.parse(reply);
                
                console.log('User blacklisted tokens -> ', blackListedTokens);

                if (blackListedTokens.find(d => d.token === blacklistModel.token)){
                    throw new UnauthorizedException();
                }
            }
        });
    }

    addToBlacklist(blacklistModel:UserBlackListTokenModel){

        let client = redis.createClient(6379);

        client.on('connect', () => {
            console.log('Connected Redis Server!');
        });

        let tokenList:UserBlackListTokenModel[] = []

        tokenList.push(blacklistModel);

        let serializeToken = JSON.stringify(tokenList);

        client.set(USER_BLACKLIST_TOKENS, serializeToken, (err,reply) => {
            console.log('User blacklisted token saved in redis: -> ', reply);
        });
    }
}

export class UserBlackListTokenModel{
    token:string;
    exp?: number;
}

export const USER_BLACKLIST_TOKENS = 'USER_BLACKLIST_TOKENS';