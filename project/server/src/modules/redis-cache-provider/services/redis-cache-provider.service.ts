import { Injectable } from "@nestjs/common";
import redis from 'redis';
import { CustomAppLogger } from "src/logger/customLogger";

@Injectable()
export class RedisCacheProviderService{

    private readonly _logger = new CustomAppLogger(RedisCacheProviderService.name);

    constructor(){}

    createClient(){

        let client = redis.createClient(process.env.REDIS_PORT);

        client.on('connect', () => {
            this._logger.info(`Connected to Redis Server. Port: ${process.env.REDIS_PORT}`);
            console.log('Connected Redis Server!');
        });
    }

    cleanCachedData(key:string){

        redis.del(key, (err,reply) => {
            this._logger.info(`Delete Redis-Server State. 
                ServerName: ${key} , 
                Reply: ${reply} , Error: ${err}`);
        });
    }

    setEntryData(key:string, data:any){

    }
}