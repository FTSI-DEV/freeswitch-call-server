import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { FreeswitchCallConfig, FreeswitchCallConfigRepository } from 'src/entity/freeswitchCallConfig.entity';
import { FreeswitchCallConfigModel, FreeswitchCallConfigModelParam } from 'src/models/freeswitchCallConfigModel';
import { IFreeswitchCallConfigService } from './ifreeswitch-call-config.interface';

const FREESWITCH_CALL_CONFIG = 'FREESWITCH_CALL_CONFIG';

@Injectable()
export class FreeswitchCallConfigService implements IFreeswitchCallConfigService {
    constructor(
        @InjectRepository(FreeswitchCallConfigRepository)
        private freeswitchConfigRepo: FreeswitchCallConfigRepository
    ) {}

    async saveUpdateCallConfig(callConfigParam: FreeswitchCallConfigModelParam){
        
        let fsCallConfig = await this.getById(callConfigParam.id);

        if (fsCallConfig == null){

            fsCallConfig = new FreeswitchCallConfig();

            fsCallConfig.Name = FREESWITCH_CALL_CONFIG;
        }

        let configModel: FreeswitchCallConfigModel = {
            friendlyName: callConfigParam.friendlyName,
            httpMethod: callConfigParam.httpMethod,
            phoneNumber: callConfigParam.phoneNumber,
            webhookUrl: callConfigParam.webhookUrl
        };

        fsCallConfig.Value = JSON.stringify(configModel);

        this.freeswitchConfigRepo.saveUpdateRecord(fsCallConfig);
    }

    getCallConfigById(id: number): any {

        return new Promise<any>((resolve, reject) => {
            this.getById(id)
                .then(result => {

                    if (result != null){
                        console.log('value', result.Value);
                    }

                    if (result == null || result.Value == undefined) resolve(null);

                    var deserialize = JSON.parse(result.Value);

                    if (deserialize != undefined){

                        let retVal = new FreeswitchCallConfigModelParam();

                        retVal.friendlyName = deserialize.friendlyName;
                        retVal.phoneNumber = deserialize.phoneNumber;
                        retVal.httpMethod = deserialize.httpMethod;
                        retVal.webhookUrl = deserialize.webhookUrl;
                        retVal.id = result.Id;

                        console.log('ret', retVal);

                        retVal = result;

                         resolve(retVal);
                        
                    }else {
                    reject(null);
                    }
                })
                .catch(error => {
                    reject(null);
                });
        }).catch(err => console.log(err));
    }

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

        return this.getCallConfigs(options);
    }

    private getCallConfigs(options: IPaginationOptions):Promise<any>{

        return new Promise<Pagination<FreeswitchCallConfigModelParam>>((resolve, reject) => {

            let pageRecords = paginate<FreeswitchCallConfig>(this.freeswitchConfigRepo, options);

            pageRecords.then(result => {
                let itemsObjs: FreeswitchCallConfigModelParam[] = [];

                result.items.forEach(element => {
                    
                    let configModel = new FreeswitchCallConfigModelParam();

                    let jsonObj = JSON.parse(element.Value);

                    configModel.friendlyName = jsonObj.friendlyName;
                    configModel.httpMethod = jsonObj.httpMethod;
                    configModel.phoneNumber = jsonObj.phoneNumber;
                    configModel.webhookUrl = jsonObj.webhookUrl;
                    configModel.id = element.Id;

                    itemsObjs.push(configModel);

                });

                resolve(new Pagination<FreeswitchCallConfigModelParam, IPaginationMeta>(itemsObjs, result.meta));

            }).catch(err => {
                reject(new Pagination<FreeswitchCallConfigModelParam, IPaginationMeta>(null, {
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
    