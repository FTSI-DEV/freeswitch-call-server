import { Inject, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import {
  IvrConfigEntity,
  IvrConfigEntityRepository,
} from 'src/entity/ivr-config.entity';
import {
  ACCOUNT_CONFIG_SERVICE,
  IAccountConfigService,
} from 'src/modules/account-config/services/account-config.interface';
import { IvrConfigModel } from '../models/ivr-config.model';
import {
  IvrOptionsCommandModel,
  IvrOptionsModel,
} from '../models/ivr-options.model';
import { IIvrConfigService } from './ivr-config.interface';

@Injectable()
export class IvrConfigService implements IIvrConfigService {
  constructor(
    @InjectRepository(IvrConfigEntityRepository)
    private readonly _ivrConfigRepo: IvrConfigEntityRepository,
    @Inject(ACCOUNT_CONFIG_SERVICE)
    private readonly _accountConfigService: IAccountConfigService,
  ) {}

  async add(param: IvrConfigModel) {
    let ivrConfig = new IvrConfigEntity();

    ivrConfig.CallerId = param.callerId;

    ivrConfig.HTTPMethod = param.httpMethod;

    ivrConfig.WebhookUrl = param.webhookUrl;

    ivrConfig.CreatedDate = new Date();

    let account = await this._accountConfigService.getById(param.accountId);

    if (account != null) {
      ivrConfig.AccountConfigEntity = account;
    }

    ivrConfig.IvrOptions = JSON.stringify(param.ivrOptions);

    await this._ivrConfigRepo.saveUpdateRecord(ivrConfig);
  }

  async update(param: IvrConfigModel): Promise<boolean> {
    let ivrConfig = await this.getRecordById(param.id);

    if (ivrConfig === undefined || ivrConfig === null) return false;

    ivrConfig.HTTPMethod = param.httpMethod;

    ivrConfig.WebhookUrl = param.webhookUrl;

    ivrConfig.CallerId = param.callerId;

    let account = await this._accountConfigService.getById(param.accountId);

    if (account != null) {
      ivrConfig.AccountConfigEntity = account;
    }

    ivrConfig.IvrOptions = JSON.stringify(param.ivrOptions);

    await this._ivrConfigRepo.saveUpdateRecord(ivrConfig);

    return true;
  }

  getByCallerId(callerId: string): Promise<IvrConfigModel> {
    return new Promise<IvrConfigModel>((resolve, reject) => {
      this._ivrConfigRepo
        .createQueryBuilder('IvrConfig')
        .where('IvrConfig.CallerId = : callerId ', { callerId: callerId })
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
              httpMethod: result.HTTPMethod,
              callerId: result.CallerId,
              isDeleted: result.IsDeleted,
              createdDate: result.CreatedDate,
              accountId: result.AccountId,
              ivrOptions: ivrOptions,
            });
          }
        })
        .catch((error) => {
          reject(null);
        });
    });
  }

  async getById(id: number): Promise<IvrConfigModel> {
    let ivr = await this.getRecordById(id);

    if (ivr === null || ivr === undefined) return null;

    let ivrOptions = new IvrOptionsCommandModel();

    if (ivr.IvrOptions !== null || ivr.IvrOptions !== undefined) {
      let ivrOptionsObj: IvrOptionsCommandModel = JSON.parse(ivr.IvrOptions);

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

    let retVal: IvrConfigModel = {
      callerId: ivr.CallerId,
      createdDate: ivr.CreatedDate,
      webhookUrl: ivr.WebhookUrl,
      httpMethod: ivr.HTTPMethod,
      accountId: ivr.AccountId,
      isDeleted: ivr.IsDeleted,
      ivrOptions: ivrOptions,
    };

    return retVal;
  }
  
  async delete(id:number):Promise<boolean>{

    let config = await this.getRecordById(id);

    if (config === null || config === undefined) return false;

    config.IsDeleted = true;

    this._ivrConfigRepo.deleteRecord(config);

    return true;
  }

  async getIvrConfigs(options:IPaginationOptions):Promise<Pagination<IvrConfigModel>>{

    let pageRecords = await paginate<IvrConfigEntity>(this._ivrConfigRepo, options);

    let itemObjs: IvrConfigModel[] = [];

    pageRecords.items.forEach(item => {

        if(!item.IsDeleted){
            let configModel:IvrConfigModel = {
                webhookUrl : item.WebhookUrl,
                callerId: item.CallerId,
                httpMethod: item.HTTPMethod,
                isDeleted: item.IsDeleted,
                id: item.Id,
                accountId: item.AccountId
            };

            itemObjs.push(configModel);
        }
    });

    itemObjs.sort((n1,n2) => {
        return (n2.id < n1.id) ? -1 : 1;
    });

    return new Pagination<IvrConfigModel, IPaginationMeta>(itemObjs, pageRecords.meta);
  }

  private getRecordById = async (id: number): Promise<IvrConfigEntity> => {
    let value = await this._ivrConfigRepo
      .createQueryBuilder('IvrConfig')
      .where('IvrConfig.Id = :id ', { id: id })
      .getOne();

    return value;
  };
}
