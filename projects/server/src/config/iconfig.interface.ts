import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const CONFIG_SERVICE = 'CONFIG SERVICE';

export interface IConfigService {
    ensureValues(keys: string[]);
    getPort();
    isProduction();
    getTypeOrmConfig():TypeOrmModuleOptions;
}