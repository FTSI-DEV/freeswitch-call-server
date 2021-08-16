import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { fscreds } from "src/entity/freeswitch.entity";
import { FreeswitchCallConfig } from "src/entity/freeswitchCallConfig.entity";
import { FreeswitchCallSystemEntity } from "src/entity/freeswitchCallSystem.entity";
import { Vehicles } from "src/entity/vehicles.entity";
import { ApiCredential } from "src/models/apiCredential.model";
import { IConfigService } from "./iconfig.interface";
require('dotenv').config();

@Injectable()
export class ConfigService implements IConfigService{
    constructor(private env: { [key: string]: string | undefined }) { }
    private getValue(key: string, throwOnMissing = true): string{
        const value = this.env[key];
        if (!value && throwOnMissing){
            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public ensureValues(keys: string[]){
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    public getPort(){
        return this.getValue('PORT', true);
    }

    public isProduction(){
        const mode = this.getValue('MODE', false);
        return mode != 'DEV';
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions{
        return{
            type: 'postgres',
            host: this.getValue('POSTGRES_HOST'),
            port: parseInt(this.getValue('POSTGRES_PORT')),
            username: this.getValue('POSTGRES_USER'),
            password: this.getValue('POSTGRES_PASSWORD'),
            database: this.getValue('POSTGRES_DATABASE'),
            entities: [FreeswitchCallConfig,FreeswitchCallSystemEntity,Vehicles],
            migrationsTableName: 'migration',
            migrations: ['src/migration/*.ts'],
            cli: {
                migrationsDir: 'src/migration',
            },
            ssl: this.isProduction(),
            synchronize: true
        };
    }

    public getApiCredentials():ApiCredential{
        const configService = new ConfigService(process.env)
            .ensureValues([
                'API_KEY',
                'API_PASSWORD'
            ]);

        return{
            apiKey: this.getValue('API_KEY'),
            apiPassword: this.getValue('API_PASSWORD')
        };
    }

    public validateApiCredential(apiKey: string, apiPassword:string):boolean{
        let apiCredential = this.getApiCredentials();

        if (apiCredential.apiKey != apiKey){
            return false;
        }

        if (apiCredential.apiPassword != apiPassword){
            return false;
        }
    }
}

const configService = new ConfigService(process.env)
.ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE'
]);

// const configService = new ConfigService(process.env)
// .ensureValues([
//   postgreConstants.HOST,
//   postgreConstants.POSTGRES_PORT,
//   postgreConstants.USER,
//   postgreConstants.PASSWORD,
//   postgreConstants.DATABASE
// ]);

export { configService };