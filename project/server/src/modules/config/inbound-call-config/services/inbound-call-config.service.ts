import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { InboundCallConfig, InboundCallConfigRepository } from 'src/entity/inboundCallConfig.entity';
import { InboundCallConfigModel, InboundCallConfigParam } from '../models/inbound-call-config.model';

@Injectable()
export class InboundCallConfigService {

    constructor(
        @InjectRepository(InboundCallConfig)
        private _inboundCallConfigRepo: InboundCallConfigRepository,
        
    ) {}

    add(param: InboundCallConfigParam){

        console.log('parma', param);
        let inboundCallConfig = new InboundCallConfig();

        inboundCallConfig.WebhookUrl = param.webhookUrl;
        inboundCallConfig.CallerId = param.callerId;
        inboundCallConfig.HTTPMethod = param.httpMethod;

        this._inboundCallConfigRepo.saveUpdateRecord(inboundCallConfig);
    }

    update(param: InboundCallConfigParam):boolean{

        this.getRecordById(param.id)
        .then((result) => {

            if (result == null || result == undefined)  return false;

            result.CallerId = param.callerId;
            result.WebhookUrl = param.webhookUrl;
            result.HTTPMethod = param.httpMethod;
            this._inboundCallConfigRepo.saveUpdateRecord(result);
        })
        .catch(err => {
            return false;
        });

        return true;
    }

    getInboundConfigCallerId(callerId: string) : any {
        return new Promise<InboundCallConfigModel>((resolve, reject) => {
            this.getConfigByCallerId(callerId)
            .then((result) => {
                if (result == null || result == undefined) reject(null);

                let retVal = new InboundCallConfigModel();
                retVal.callerId = result.CallerId;
                retVal.webhookUrl = result.WebhookUrl;
                retVal.httpMethod = result.HTTPMethod;

                resolve(retVal);

            }).catch((err) => {
                reject(null);
            });
        })
    }

    getInboundCallConfigById(id:number):any{
        return new Promise<InboundCallConfigModel>((resolve,reject) => {
            this.getRecordById(id)
                .then((result) => {
                    if (result == null || result == undefined) reject(null);

                    let configModel: InboundCallConfigModel = {
                        webhookUrl: result.WebhookUrl,
                        callerId: result.CallerId,
                        id: result.Id,
                        httpMethod: result.HTTPMethod
                    };

                    resolve(configModel);
                })
                .catch((err) => {
                    reject(null);
                })
        })
    }

    getInboundCallConfigs(options: IPaginationOptions): Promise<any>{
        return new Promise<Pagination<InboundCallConfigModel>>((resolve,reject) => {

            let pageRecords = paginate<InboundCallConfig>(this._inboundCallConfigRepo, options);

            pageRecords.then(result => {

                let itemsObjs: InboundCallConfigModel[] = [];

                result.items.forEach(element => {

                    let configModel = new InboundCallConfigModel();

                    configModel.webhookUrl = element.WebhookUrl;
                    configModel.callerId = element.CallerId;
                    configModel.httpMethod = element.HTTPMethod;
                    configModel.id = element.Id;

                    itemsObjs.push(configModel);
                });

                resolve(new Pagination<InboundCallConfigModel, IPaginationMeta>(itemsObjs, result.meta));
            })
            .catch(err => {
                reject(new Pagination<InboundCallConfigModel, IPaginationMeta>(null, {
                    itemCount: 0,
                    itemsPerPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    currentPage: 0
                }));
            })
            .catch(err => {
                reject(new Pagination<InboundCallConfigModel, IPaginationMeta>(null, {
                    itemCount: 0,
                    itemsPerPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    currentPage: 0
                }));
            });
        })
    }

    private getConfigByCallerId = (callerId:string) : any => {
        return new Promise<InboundCallConfig>((resolve,reject) => {
            
            this._inboundCallConfigRepo.createQueryBuilder("public.InboundCallConfig")
                .where("public.InboundCallConfig.CallerId = :callerId" , { callerId : callerId })
                .getOneOrFail()
                .then(result => {
                    if (result == null || result == undefined){
                        reject(null);
                    }
                    else {
                        resolve(result);
                    }
                })
                .catch(err => {
                    reject(null);
                })
        })
    }

    private getRecordById = (id:number) : Promise<InboundCallConfig> => {
        return this._inboundCallConfigRepo.findOneOrFail(id);
    } 

}
