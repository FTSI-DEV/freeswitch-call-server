import { UnauthorizedException } from '@nestjs/common';
import redis from 'redis';

export class ProjectAccountBlacklistedTokenValidator{

    constructor(

        
    ){}

    validate(blacklistModel:ProjectAccountBlacklistTokenModel){

        let redisClient = redis.createClient(6379);

        redisClient.on('connect', () => {
            console.log('Connected Redis Server!');
        });

        redisClient.get(PROJECTACCOUNT_BLACKLIST_TOKENS, (err, reply) => {

            if (reply){

                let blackListedTokens:ProjectAccountBlacklistTokenModel[] = JSON.parse(reply);
                
                console.log('User blacklisted tokens -> ', blackListedTokens);

                if (blackListedTokens.find(d => d.token === blacklistModel.token)){
                    throw new UnauthorizedException();
                }
            }
        });
    }

    addToBlacklist(blacklistModel:ProjectAccountBlacklistTokenModel){

        let client = redis.createClient(6379);

        client.on('connect', () => {
            console.log('Connected Redis Server!');
        });

        let tokenList:ProjectAccountBlacklistTokenModel[] = []

        tokenList.push(blacklistModel);

        if (tokenList.find(c => c.token === blacklistModel.token)){
            console.log('Token already blacklisted');
            return;
        }

        let serializeToken = JSON.stringify(tokenList);

        client.set(PROJECTACCOUNT_BLACKLIST_TOKENS, serializeToken, (err,reply) => {
            console.log('User blacklisted token saved in redis: -> ', reply);
        });
    }
}

export class ProjectAccountBlacklistTokenModel{
    token:string;
    exp?: number;
}

export const PROJECTACCOUNT_BLACKLIST_TOKENS = 'PROJECTACCOUNT_BLACKLIST_TOKENS';