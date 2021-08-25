import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { rejects } from 'assert';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { PhoneNumberConfig, PhoneNumberConfigRepository } from 'src/entity/phoneNumberConfig.entity';
import { FreeswitchPhoneNumberConfigParam } from 'src/models/freeswitchCallConfigModel';
import { IFreeswitchPhoneNumberConfigService as IFreeswitchPhoneNumberConfigService } from './iphonenumber-config.interface';

@Injectable()
export class FreeswitchPhoneNumberConfigService{
    constructor(
        @InjectRepository(PhoneNumberConfigRepository)
        private _phoneNumberConfigRepo: PhoneNumberConfigRepository,
    ) {}

    add(param: FreeswitchPhoneNumberConfigParam){

        let phoneNumberConfig = new PhoneNumberConfig();

        phoneNumberConfig.FriendlyName = param.friendlyName;
        phoneNumberConfig.HttpMethod = param.httpMethod;
        phoneNumberConfig.WebhookUrl = param.webhookUrl;
        phoneNumberConfig.PhoneNumber = param.phoneNumber;

        this._phoneNumberConfigRepo.saveUpdateRecord(phoneNumberConfig);
    }

    update(param: FreeswitchPhoneNumberConfigParam):boolean{

        this.getRecordById(param.id)
        .then((result) => {

            if (result == null || result == undefined) return false;

            result.FriendlyName = param.friendlyName;
            result.HttpMethod = param.httpMethod;
            result.WebhookUrl = param.webhookUrl;
            result.PhoneNumber = param.phoneNumber

            this._phoneNumberConfigRepo.saveUpdateRecord(result);

        }).catch((err) => {
            return false;
        });

        return true;

    }

    getPhone(id:number):any{

        this.getPhoneNumberConfigById(id)
        .then((result) => {
            return result;
        }).catch((err) => {
            return err;
        });
    }

    getPhoneNumberConfigById(id: number): any{

        return new Promise<FreeswitchPhoneNumberConfigParam>((resolve, reject) => {
            this.getById(id)
                .then((result) => {
                    
                    if (result == null || result == undefined){
                        reject(null);
                    }

                    let configModel: FreeswitchPhoneNumberConfigParam = {
                        friendlyName: result.FriendlyName,
                        phoneNumber: result.PhoneNumber,
                        httpMethod: result.HttpMethod,
                        webhookUrl: result.WebhookUrl,
                        id: result.Id
                    };
                    resolve(configModel);

                }).catch((err) => {
                    reject(null);
                });
        })
        .catch(err => {
            return null;
        });
    }

    getAll(options:IPaginationOptions) :any{

        return this.getPhoneNumberConfigs(options);
    }

    private getRecordById(id:number):any{

        this.getPhoneNumberConfigById(id)
        .then((result) => {
            if (result == null){
                return null;
            }
            else{
                return result;
            }
        }).catch((err) => {
            return null;
        });
    }

    private getById = (id: number): any => {

        return new Promise<PhoneNumberConfig>((resolve,reject) => {
            this._phoneNumberConfigRepo.findOneOrFail(id)
            .then(result => {
                if (result == null || result == undefined){
                    reject(null);
                }
                else {
                    console.log('getbyId:resolve', result);
                    resolve(result);
                }
            })
            .catch(err => {
                reject(null);
            });
        })
        .catch(err => {
            console.log('err', err);
        });
    }

    private getPhoneNumberConfigs(options: IPaginationOptions):Promise<any>{

        return new Promise<Pagination<FreeswitchPhoneNumberConfigParam>>((resolve, reject) => {

            let pageRecords = paginate<PhoneNumberConfig>(this._phoneNumberConfigRepo, options);

            pageRecords.then(result => {
                let itemsObjs: FreeswitchPhoneNumberConfigParam[] = [];

                result.items.forEach(element => {
                    
                    let configModel = new FreeswitchPhoneNumberConfigParam();

                    configModel.friendlyName = element.FriendlyName;
                    configModel.httpMethod = element.HttpMethod;
                    configModel.phoneNumber = element.PhoneNumber;
                    configModel.webhookUrl = element.WebhookUrl;
                    configModel.id = element.Id;

                    itemsObjs.push(configModel);

                });

                resolve(new Pagination<FreeswitchPhoneNumberConfigParam, IPaginationMeta>(itemsObjs, result.meta));

            }).catch(err => {
                reject(new Pagination<FreeswitchPhoneNumberConfigParam, IPaginationMeta>(null, {
                    itemCount: 0,
                    itemsPerPage: 0,
                    totalItems: 0,
                    totalPages : 0,
                    currentPage: 0
                }));
            })
        }).catch(error => {
            console.log('error', error);
        })
    }
}
    