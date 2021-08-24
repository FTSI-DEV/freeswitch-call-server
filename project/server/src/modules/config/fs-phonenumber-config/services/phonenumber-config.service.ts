import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FreeswitchCallConfig, FreeswitchCallConfigRepository } from 'src/entity/freeswitchCallConfig.entity';
import { FS_PHONENUMBER_CONFIG } from 'src/helpers/constants/call-config.constants';
import { FreeswitchPhoneNumberConfigModel, FreeswitchPhoneNumberConfigParam } from 'src/models/freeswitchCallConfigModel';
import { IFreeswitchPhoneNumberConfigService as IFreeswitchPhoneNumberConfigService } from './iphonenumber-config.interface';

@Injectable()
export class FreeswitchPhoneNumberConfigService implements IFreeswitchPhoneNumberConfigService {
    constructor(
        @InjectRepository(FreeswitchCallConfigRepository)
        private freeswitchConfigRepo: FreeswitchCallConfigRepository
    ) {}

    saveUpdatePhoneNumberConfig(callConfigParam: FreeswitchPhoneNumberConfigParam){
        
        // let fsCallConfig = await this.getById(callConfigParam.id);

        let fsCallConfig = this.getPhoneNumberConfigById(callConfigParam.id);

        if (fsCallConfig == null){

            fsCallConfig = new FreeswitchCallConfig();

            fsCallConfig.Name = FS_PHONENUMBER_CONFIG;
        }

        let configModel: FreeswitchPhoneNumberConfigModel = {
            friendlyName: callConfigParam.friendlyName,
            httpMethod: callConfigParam.httpMethod,
            phoneNumber: callConfigParam.phoneNumber,
            webhookUrl: callConfigParam.webhookUrl
        };

        fsCallConfig.Value = JSON.stringify(configModel);

        this.freeswitchConfigRepo.saveUpdateRecord(fsCallConfig);
    }

    getPhoneNumberConfigById(id: number): any{
        return new Promise<FreeswitchPhoneNumberConfigParam>((resolve, reject) => {

            this.getById(id)
                .then((result) => {
                    
                    if (result == null || result.Value == undefined) reject(null);

                    var deserialize = JSON.parse(result.Value);

                    if (deserialize != null){

                        let configModel: FreeswitchPhoneNumberConfigParam = {
                            friendlyName: deserialize.friendlyName,
                            phoneNumber: deserialize.phoneNumber,
                            httpMethod: deserialize.httpMethod,
                            webhookUrl: deserialize.webhookUrl,
                            id: result.Id
                        };

                        resolve(configModel);
                    }
                    else {
                        reject(null);
                    }

                }).catch((err) => {
                    reject(null);
                });
        })
    }

    // getCallConfigById(id: number): any {

    //     return new Promise<any>((resolve, reject) => {
    //         this.getById(id)
    //             .then(result => {

    //                 if (result != null){
    //                     console.log('value', result.Value);
    //                 }

    //                 if (result == null || result.Value == undefined) resolve(null);

    //                 var deserialize = JSON.parse(result.Value);

    //                 if (deserialize != undefined){

    //                     let retVal = new FreeswitchCallConfigModelParam();

    //                     retVal.friendlyName = deserialize.friendlyName;
    //                     retVal.phoneNumber = deserialize.phoneNumber;
    //                     retVal.httpMethod = deserialize.httpMethod;
    //                     retVal.webhookUrl = deserialize.webhookUrl;
    //                     retVal.id = result.Id;

    //                     console.log('ret', retVal);

    //                     retVal = result;

    //                      resolve(retVal);
                        
    //                 }else {
    //                 reject(null);
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(null);
    //             });
    //     }).catch(err => console.log(err));
    // }

    private getById = (id: number): any => {

        return new Promise<FreeswitchCallConfig>((resolve,reject) => {
        
            let record = this.freeswitchConfigRepo.findOneOrFail(id)
            .then(result => {
                if (result == null){
                    reject(null);
                }
                else{
                    resolve(result);
                }
            });
        }); 
    }

    getAll(options:IPaginationOptions) :any{

        return this.getPhoneNumberConfigs(options);
    }

    private getPhoneNumberConfigs(options: IPaginationOptions):Promise<any>{

        return new Promise<Pagination<FreeswitchPhoneNumberConfigParam>>((resolve, reject) => {

            let pageRecords = paginate<FreeswitchCallConfig>(this.freeswitchConfigRepo, options);

            pageRecords.then(result => {
                let itemsObjs: FreeswitchPhoneNumberConfigParam[] = [];

                result.items.forEach(element => {
                    
                    let configModel = new FreeswitchPhoneNumberConfigParam();

                    let jsonObj = JSON.parse(element.Value);

                    configModel.friendlyName = jsonObj.friendlyName;
                    configModel.httpMethod = jsonObj.httpMethod;
                    configModel.phoneNumber = jsonObj.phoneNumber;
                    configModel.webhookUrl = jsonObj.webhookUrl;
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
    