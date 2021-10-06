import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountConfigEntity, AccountConfigEntityRepository } from 'src/entity/account-config.entity';
import { AccountConfigModel } from '../models/accountConfig.model';
import { v4 as uuidv4 } from 'uuid';
import { AccountConfigDTO } from '../models/accountConfigDto.model';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { IAccountConfigService } from './account-config.interface';

@Injectable()
export class AccountConfigService implements IAccountConfigService{

    constructor(
        @InjectRepository(AccountConfigEntityRepository)
        private _accountConfigRepo: AccountConfigEntityRepository
    ){}

    async add(accountName:string):Promise<number>{

        let accountConfig = new AccountConfigEntity();

        accountConfig.AuthKey = uuidv4();

        accountConfig.AccountSID = uuidv4();

        accountConfig.AccountName = accountName;

        accountConfig.DateCreated = new Date();

        accountConfig.IsActive = true;

        accountConfig = await this._accountConfigRepo.saveConfig(accountConfig);

        return accountConfig.Id;
    }

    async update(param:AccountConfigModel):Promise<number>{

        let config = await this.getById(param.id);

        config.AuthKey = param.accountName;

        config.DateUpdated = new Date();

        config = await this._accountConfigRepo.saveConfig(config);

        return config.Id;
    }

    async delete(param:AccountConfigModel):Promise<boolean>{

        let config = await this.getById(param.id);

        if (config){

            config.IsActive = param.isActive;

            config.DateUpdated = new Date();

            return true;
        }

        return false;
    }

    async getById(id:number):Promise<AccountConfigEntity>{

        let config = await this._accountConfigRepo.createQueryBuilder("AccountConfig")
            .where("AccountConfig.Id = :id" , { id: id })
            .getOne();
        
       return config;
    }

    async getByAccountSID(accountSID:string):Promise<AccountConfigDTO>{

        let account = await this._accountConfigRepo.createQueryBuilder("AccountConfig")
            .where("AccountConfig.AccountSID = :accountSID", { accountSID : accountSID })
            .getOne();

        if (account) return null;

        return {
            id: account.Id,
            accountName: account.AccountName,
            accountSID : account.AccountSID,
            isActive: account.IsActive,
            authKey: account.AuthKey,
            dateCreated: account.DateCreated
        };
    }

    async getConfigs(options: IPaginationOptions) : Promise<Pagination<AccountConfigDTO>>{

        let pageRecords = await paginate<AccountConfigEntity>(this._accountConfigRepo, options);

        let itemObjs : AccountConfigDTO[] = [];

        pageRecords.items.forEach(item => {

            if (!item.IsActive){
                return;
            }

            let model : AccountConfigDTO = {
                id: item.Id,
                accountSID: item.AccountSID,
                authKey : item.AuthKey,
                accountName  : item.AccountName,
                isActive: item.IsActive,
                dateCreated: item.DateCreated
            };

            itemObjs.push(model);
        });

        itemObjs.sort((n1,n2) => {
            return (n2.id < n1.id) ? -1 : 1;
        });

        return new Pagination<AccountConfigDTO, IPaginationMeta>(itemObjs, pageRecords.meta);
    }
}
