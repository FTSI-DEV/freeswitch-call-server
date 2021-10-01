import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { CallRecordingStorageEntity } from "src/entity/callRecordingStorage.entity";
import { FreeswitchCallConfigEntity } from "src/entity/freeswitchCallConfig.entity";
import { InboundCallConfigEntity } from "src/entity/inboundCallConfig.entity";
import { PhoneNumberConfigEntity } from "src/entity/phoneNumberConfig.entity";
import { ApiCredential } from "src/models/apiCredential.model";
import { IConfigService } from "./iconfig.interface";
import { AccountConfigEntity } from "src/entity/account-config";
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
            // entities: [FreeswitchCallConfigEntity,
            //             CallRecordingStorageEntity,
            //            FsCallDetailRecordEntity,
            //            InboundCallConfigEntity,
            //            PhoneNumberConfigEntity],
            entities : ["dist/entity/**/*.js"],
            migrationsTableName : "MigrationTable",
            migrations: ['dist/migration/**/*.js'],
            migrationsRun: true,
            cli: {
                migrationsDir: 'src/migration',
                entitiesDir: 'src/entity'
            },
            ssl: this.isProduction(),
            synchronize: false
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