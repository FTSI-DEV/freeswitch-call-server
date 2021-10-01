import { IPaginationOptions, Pagination } from "nestjs-typeorm-paginate";
import { AccountConfigEntity } from "src/entity/account-config";
import { AccountConfigModel } from "../models/accountConfig.model";
import { AccountConfigDTO } from "../models/accountConfigDto.model";

export const ACCOUNT_CONFIG_SERVICE = 'ACCOUNT_CONFIG_SERVICE';

export interface IAccountConfigService{
    add(param:AccountConfigModel):Promise<number>;
    update(param:AccountConfigModel):Promise<number>;
    getById(id:number):Promise<AccountConfigEntity>;
    getConfigs(options: IPaginationOptions) : Promise<Pagination<AccountConfigDTO>>;
} 