import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { InboundRulesConfigEntity, InboundRulesConfigRepository } from 'src/entity/inbound-rules-config.entityt';
import { ACCOUNT_CONFIG_SERVICE, IAccountConfigService } from 'src/modules/account-config/services/account-config.interface';
import { InboundRulesConfigModel } from '../models/inbound-rules.model';
import { IvrOptionsCommandModel } from '../models/ivr-options.model';

@Injectable()
export class InboundRulesConfigService {

    constructor(
        @InjectRepository(InboundRulesConfigEntity)
        private _inboundRulesConfigRepo: InboundRulesConfigRepository,
        @Inject(ACCOUNT_CONFIG_SERVICE)
        private _accountConfigService: IAccountConfigService
    ){}

    async add(param: InboundRulesConfigModel){
        
        let config = new InboundRulesConfigEntity();

        config.CallTypeId = param.callTypeId;

        config.CallerId = param.callerId;

        config.WebhookUrl = param.webhookUrl;

        config.HttpMethod = param.httpMethod;

        config.CreatedDate = new Date();

        config.IvrOptions = JSON.stringify(param.ivrOptions);

        let account = await this._accountConfigService.getById(param.accountId);

        if (account != null)
            config.AccountConfigEntity = account;

        await this._inboundRulesConfigRepo.saveUpdateRecord(config);
    }

    async update(param: InboundRulesConfigModel):Promise<boolean>{

        let config = await this.getRecordById(param.id);

        if (config === null || config === undefined) return false;

        config.HttpMethod = param.httpMethod;

        config.WebhookUrl = param.webhookUrl;

        config.CallerId = param.callerId;

        config.CallTypeId = param.callTypeId;

        config.IvrOptions = JSON.stringify(param.ivrOptions);

        let account = await this._accountConfigService.getById(param.accountId);

        if (account != null)
            config.AccountConfigEntity = account;

        await this._inboundRulesConfigRepo.saveUpdateRecord(config);

        return true;

    }

    getByCallerId(callerId: string): Promise<InboundRulesConfigModel> {
        return new Promise<InboundRulesConfigModel>((resolve, reject) => {
          this._inboundRulesConfigRepo
            .createQueryBuilder('InboundRulesConfig')
            .where('InboundRulesConfig.CallerId = : callerId ', { callerId: callerId })
            .getOneOrFail()
            .then((result) => {
              if (result === null || result === undefined) {
                reject(null);
              } else {
                let ivrOptions = new IvrOptionsCommandModel();
    
                if (result.IvrOptions !== null || result.IvrOptions !== undefined) {
                  let ivrOptionsObj: IvrOptionsCommandModel = JSON.parse(
                    result.IvrOptions,
                  );
    
                  if (ivrOptionsObj !== null || ivrOptionsObj !== undefined) {
                    ivrOptions.failedMessage = ivrOptionsObj.failedMessage;
                    ivrOptions.redirectMessage = ivrOptionsObj.redirectMessage;
                    ivrOptions.failedRetryMessage =
                      ivrOptionsObj.failedRetryMessage;
                    ivrOptions.ivrRetryCount = ivrOptionsObj.ivrRetryCount;
                    ivrOptions.ivrScript = ivrOptionsObj.ivrScript;
                    ivrOptions.preRedirectMessage =
                      ivrOptionsObj.preRedirectMessage;
                    ivrOptions.redirectMessage = ivrOptionsObj.redirectMessage;
                    ivrOptions.welcomeMessage = ivrOptionsObj.welcomeMessage;
                    ivrOptions.welcomeRecordUrl = ivrOptionsObj.welcomeRecordUrl;
                    ivrOptions.wrongInputRetryMessage =
                      ivrOptionsObj.wrongInputRetryMessage;
    
                    ivrOptionsObj.ivrOptions.forEach((ivrOption) => {
                      ivrOptions.ivrOptions.push(ivrOption);
                    });
                  }
                }
    
                resolve({
                  id: result.Id,
                  webhookUrl: result.WebhookUrl,
                  httpMethod: result.HttpMethod,
                  callerId: result.CallerId,
                  isDeleted: result.IsDeleted,
                  createdDate: result.CreatedDate,
                  accountId: result.AccountId,
                  ivrOptions: ivrOptions,
                  callTypeId: result.CallTypeId
                });
              }
            })
            .catch((error) => {
              reject(null);
            });
        });
    }

    async getById(id: number): Promise<InboundRulesConfigModel> {

        let config = await this.getRecordById(id);
    
        if (config === null || config === undefined) return null;
    
        let ivrOptions = new IvrOptionsCommandModel();
    
        if (config.IvrOptions !== null || config.IvrOptions !== undefined) {
          let ivrOptionsObj: IvrOptionsCommandModel = JSON.parse(config.IvrOptions);
    
          if (ivrOptionsObj !== null || ivrOptionsObj !== undefined) {
            ivrOptions.failedMessage = ivrOptionsObj.failedMessage;
            ivrOptions.redirectMessage = ivrOptionsObj.redirectMessage;
            ivrOptions.failedRetryMessage = ivrOptionsObj.failedRetryMessage;
            ivrOptions.ivrRetryCount = ivrOptionsObj.ivrRetryCount;
            ivrOptions.ivrScript = ivrOptionsObj.ivrScript;
            ivrOptions.preRedirectMessage = ivrOptionsObj.preRedirectMessage;
            ivrOptions.redirectMessage = ivrOptionsObj.redirectMessage;
            ivrOptions.welcomeMessage = ivrOptionsObj.welcomeMessage;
            ivrOptions.welcomeRecordUrl = ivrOptionsObj.welcomeRecordUrl;
            ivrOptions.wrongInputRetryMessage =
              ivrOptionsObj.wrongInputRetryMessage;
    
            ivrOptionsObj.ivrOptions.forEach((ivrOption) => {
              ivrOptions.ivrOptions.push(ivrOption);
            });
          }
        }
    
        let retVal: InboundRulesConfigModel = {
          callerId: config.CallerId,
          createdDate: config.CreatedDate,
          webhookUrl: config.WebhookUrl,
          httpMethod: config.HttpMethod,
          accountId: config.AccountId,
          isDeleted: config.IsDeleted,
          ivrOptions: ivrOptions,
          callTypeId : config.CallTypeId
        };
    
        return retVal;
    }

    async delete(id:number):Promise<boolean>{

        let config = await this.getRecordById(id);
    
        if (config === null || config === undefined) return false;
    
        config.IsDeleted = true;
    
        this._inboundRulesConfigRepo.deleteRecord(config);
    
        return true;
    }

    async getConfigs(options:IPaginationOptions):Promise<Pagination<InboundRulesConfigModel>>{

        let pageRecords = await paginate<InboundRulesConfigEntity>(this._inboundRulesConfigRepo, options);
    
        let itemObjs: InboundRulesConfigModel[] = [];
    
        pageRecords.items.forEach(item => {
    
            if(!item.IsDeleted){
                let configModel:InboundRulesConfigModel = {
                    webhookUrl : item.WebhookUrl,
                    callerId: item.CallerId,
                    httpMethod: item.HttpMethod,
                    isDeleted: item.IsDeleted,
                    id: item.Id,
                    accountId: item.AccountId,
                    callTypeId : item.CallTypeId
                };
    
                itemObjs.push(configModel);
            }
        });
    
        itemObjs.sort((n1,n2) => {
            return (n2.id < n1.id) ? -1 : 1;
        });
    
        return new Pagination<InboundRulesConfigModel, IPaginationMeta>(itemObjs, pageRecords.meta);
    }

    private getRecordById = async (id: number): Promise<InboundRulesConfigEntity> => {
        
        let value = await this._inboundRulesConfigRepo
          .createQueryBuilder('InboundRulesConfig')
          .where('InboundRulesConfig.Id = :id ', { id: id })
          .getOne();
    
        return value;
    }

}
