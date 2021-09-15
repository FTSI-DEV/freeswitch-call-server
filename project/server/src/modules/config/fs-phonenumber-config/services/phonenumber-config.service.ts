import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { rejects } from 'assert';
import e from 'express';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PhoneNumberConfigEntity, PhoneNumberConfigRepository } from 'src/entity/phoneNumberConfig.entity';
import { FreeswitchPhoneNumberConfigParam } from 'src/models/freeswitchCallConfigModel';
import { IFreeswitchPhoneNumberConfigService as IFreeswitchPhoneNumberConfigService } from './iphonenumber-config.interface';

@Injectable()
export class FreeswitchPhoneNumberConfigService{
    constructor(
        @InjectRepository(PhoneNumberConfigRepository)
        private _phoneNumberConfigRepo: PhoneNumberConfigRepository,
    ) {}

    async add(param: FreeswitchPhoneNumberConfigParam){

        let phoneNumberConfig = new PhoneNumberConfigEntity();

        phoneNumberConfig.FriendlyName = param.friendlyName;
        phoneNumberConfig.HttpMethod = param.httpMethod;
        phoneNumberConfig.WebhookUrl = param.webhookUrl;
        phoneNumberConfig.PhoneNumber = param.phoneNumber;

        await this._phoneNumberConfigRepo.saveUpdateRecord(phoneNumberConfig);
    }

    async update(param: FreeswitchPhoneNumberConfigParam):Promise<boolean>{

        let config = await this.getById(param.id);

        if (config === null || config === undefined) return false;

        config.FriendlyName = param.friendlyName;
        config.WebhookUrl = param.webhookUrl;
        config.PhoneNumber = param.phoneNumber;
        config.HttpMethod = param.httpMethod;

        await this._phoneNumberConfigRepo.saveUpdateRecord(config);

        return true;
    }

    async getPhoneNumberConfigById(id: number): Promise<FreeswitchPhoneNumberConfigParam>{

        let config = await this.getById(id);

        if (config === null || config === undefined) return null;

        let configModel: FreeswitchPhoneNumberConfigParam = {
            friendlyName: config.FriendlyName,
            phoneNumber: config.PhoneNumber,
            httpMethod: config.HttpMethod,
            webhookUrl: config.WebhookUrl,
            id: config.Id,
            isDeleted: config.IsDeleted
        };

        return configModel;
    }

    async getPhoneNumberConfigs(options:IPaginationOptions) : Promise<Pagination<FreeswitchPhoneNumberConfigParam>>{

        let pageRecords = await paginate<PhoneNumberConfigEntity>(this._phoneNumberConfigRepo, options);

        let itemObjs: FreeswitchPhoneNumberConfigParam[] = [];

        pageRecords.items.forEach(element => {
            if (!element.IsDeleted){
                let configModel: FreeswitchPhoneNumberConfigParam = {
                    webhookUrl : element.WebhookUrl,
                    httpMethod: element.HttpMethod,
                    phoneNumber: element.PhoneNumber,
                    id: element.Id,
                    friendlyName: element.FriendlyName,
                    isDeleted : element.IsDeleted
                };

                itemObjs.push(configModel);
            }
        });

        itemObjs.sort((n1,n2) => {
            if (n1.id < n2.id){
                return 1;
            }

            if (n1.id > n2.id){
                return -1;
            }

            return 0;
        });

        return new Pagination<FreeswitchPhoneNumberConfigParam, IPaginationMeta>(itemObjs, pageRecords.meta);
    }

    private getById = async (id: number): Promise<PhoneNumberConfigEntity> => {
        
        let value = await this._phoneNumberConfigRepo.createQueryBuilder("PhoneNumberConfig")
            .where("PhoneNumberConfig.Id = :id" , { id: id})
            .getOne();

        return value;
    }

    deletePhoneNumberConfig(id: number): Promise<string> {
      return new Promise<string>(async (resolve, reject) => {
        const config = await this._phoneNumberConfigRepo.findOneOrFail({ where: { Id: id } });
        if (!config.IsDeleted) {
            let phoneNumberConfig = new PhoneNumberConfigEntity();
            phoneNumberConfig.Id = id;
            phoneNumberConfig.IsDeleted = true;
            this._phoneNumberConfigRepo.deleteRecord(phoneNumberConfig);
            resolve("Config successfully deleted");
        } else {
            reject("Unable to delete config");
        }
      });
    }
}
    