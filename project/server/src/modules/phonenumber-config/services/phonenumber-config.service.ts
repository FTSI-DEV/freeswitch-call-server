import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PhoneNumberConfigEntity, PhoneNumberConfigRepository } from 'src/entity/phoneNumberConfig.entity';
import { PhoneNumberConfigParam as PhoneNumberConfigParam } from 'src/modules/phonenumber-config/models/phoneNumberConfig.model';
import { IPhoneNumberConfigService } from './iphonenumber-config.interface';

@Injectable()
export class PhoneNumberConfigService implements IPhoneNumberConfigService{
    constructor(
        @InjectRepository(PhoneNumberConfigRepository)
        private _phoneNumberConfigRepo: PhoneNumberConfigRepository,
    ) {}

    async add(param: PhoneNumberConfigParam){

        let phoneNumberConfig = new PhoneNumberConfigEntity();

        phoneNumberConfig.FriendlyName = param.friendlyName;
        phoneNumberConfig.HttpMethod = param.httpMethod;
        phoneNumberConfig.WebhookUrl = param.webhookUrl;
        phoneNumberConfig.PhoneNumber = param.phoneNumber;

        await this._phoneNumberConfigRepo.saveUpdateRecord(phoneNumberConfig);
    }

    async update(param: PhoneNumberConfigParam):Promise<boolean>{

        let config = await this.getRecordById(param.id);

        if (config === null || config === undefined) return false;

        config.FriendlyName = param.friendlyName;
        config.WebhookUrl = param.webhookUrl;
        config.PhoneNumber = param.phoneNumber;
        config.HttpMethod = param.httpMethod;

        await this._phoneNumberConfigRepo.saveUpdateRecord(config);

        return true;
    }

    async getById(id: number): Promise<PhoneNumberConfigParam>{

        let config = await this.getRecordById(id);

        if (config === null || config === undefined) return null;

        let configModel: PhoneNumberConfigParam = {
            friendlyName: config.FriendlyName,
            phoneNumber: config.PhoneNumber,
            httpMethod: config.HttpMethod,
            webhookUrl: config.WebhookUrl,
            id: config.Id,
            isDeleted: config.IsDeleted
        };

        return configModel;
    }

    async getPhoneNumberConfigs(options:IPaginationOptions) : Promise<Pagination<PhoneNumberConfigParam>>{

        let pageRecords = await paginate<PhoneNumberConfigEntity>(this._phoneNumberConfigRepo, options);

        let itemObjs: PhoneNumberConfigParam[] = [];

        pageRecords.items.forEach(element => {
            if (!element.IsDeleted){
                let configModel: PhoneNumberConfigParam = {
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

        return new Pagination<PhoneNumberConfigParam, IPaginationMeta>(itemObjs, pageRecords.meta);
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

    private getRecordById = async (id: number): Promise<PhoneNumberConfigEntity> => {
        
        let value = await this._phoneNumberConfigRepo.createQueryBuilder("PhoneNumberConfig")
            .where("PhoneNumberConfig.Id = :id" , { id: id})
            .getOne();

        return value;
    }
}
    