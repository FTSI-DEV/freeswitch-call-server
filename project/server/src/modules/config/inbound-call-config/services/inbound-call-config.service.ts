import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { config } from 'rxjs';
import { InboundCallConfigEntity, InboundCallConfigRepository } from 'src/entity/inboundCallConfig.entity';
import { JsonResultStatus } from 'src/utils/jsonResultStatus.enum';
import { InboundCallConfigModel, InboundCallConfigParam } from '../models/inbound-call-config.model';

@Injectable()
export class InboundCallConfigService {

    constructor(
        @InjectRepository(InboundCallConfigRepository)
        private _inboundCallConfigRepo: InboundCallConfigRepository
    ) {}

    async add(param: InboundCallConfigParam):Promise<boolean>{

        let inboundCallConfig = new InboundCallConfigEntity();

        inboundCallConfig.WebhookUrl = param.webhookUrl;
        inboundCallConfig.CallerId = param.callerId;
        inboundCallConfig.HTTPMethod = param.httpMethod;
        inboundCallConfig.CreatedDate = new Date;

        await this._inboundCallConfigRepo.saveUpdateRecord(inboundCallConfig);

        return true;
    }

    async update(param: InboundCallConfigParam):Promise<boolean>{

        let config = await this.getRecordById(param.id);

        if (config === null || config === undefined) return false;

        config.HTTPMethod = param.httpMethod;
        config.WebhookUrl = param.webhookUrl;
        config.CallerId = param.callerId;

        await this._inboundCallConfigRepo.saveUpdateRecord(config);

        return true;
    }

    getInboundConfigCallerId(callerId: string) : Promise<InboundCallConfigModel> {

        return new Promise<InboundCallConfigModel>((resolve,reject) => {

            this.getConfigByCallerId(callerId)
            .then(config => {
                
                if (config === null || config === undefined) reject(null);

                resolve({
                    id:config.Id,
                    webhookUrl: config.WebhookUrl,
                    httpMethod: config.HTTPMethod,
                    callerId:config.CallerId,
                    isDeleted:config.IsDeleted
                });
            })
            .catch(err => {
                reject(`Error -> ${err}`);
            });
        });
    }

    getInboundCallConfigById(id:number):Promise<InboundCallConfigModel>{
        return new Promise<InboundCallConfigModel>((resolve,reject) => {
            this.getRecordById(id)
                .then((result) => {
                    if (result == null || result == undefined) reject(null);

                    let configModel: InboundCallConfigModel = {
                        webhookUrl: result.WebhookUrl,
                        callerId: result.CallerId,
                        id: result.Id,
                        httpMethod: result.HTTPMethod,
                        isDeleted: result.IsDeleted
                    };

                    resolve(configModel);
                })
                .catch((err) => {
                    reject(null);
                })
        })
    }

    async getInboundCallConfigs(options: IPaginationOptions): Promise<Pagination<InboundCallConfigModel>>{
        
        let pageRecords = await paginate<InboundCallConfigEntity>(this._inboundCallConfigRepo, options);

        let itemsObjs: InboundCallConfigModel[] = [];

        pageRecords.items.forEach(element => {

            if(!element.IsDeleted){
                let configModel:InboundCallConfigModel = {
                    webhookUrl : element.WebhookUrl,
                    callerId: element.CallerId,
                    httpMethod: element.HTTPMethod,
                    isDeleted: element.IsDeleted,
                    id: element.Id
                };

                itemsObjs.push(configModel);
            }
        });

        // itemsObjs.sort((n1,n2) => n1.id - n2.id);

        itemsObjs.sort((n1,n2) => {
            if (n1.id < n2.id){
                return 1;
            }

            if (n1.id > n2.id){
                return -1;
            }

            return 0;
        });

        return new Pagination<InboundCallConfigModel, IPaginationMeta>(itemsObjs, pageRecords.meta);
    
    }

    private getConfigByCallerId = (callerId:string) : Promise<InboundCallConfigEntity> => {
        return new Promise<InboundCallConfigEntity>((resolve,reject) => {
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

    private getRecordById = async (id:number) : Promise<InboundCallConfigEntity> => {
       
        let value = await this._inboundCallConfigRepo.createQueryBuilder("InboundCallConfig")
            .where("InboundCallConfig.Id = :id", {id : id})
            .getOne();

        return value;
    }
    
    async deleteInboundCallConfig(id: number): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            const config = await this.getRecordById(id);
            if (!config.IsDeleted) {
                let inboundCallConfig = new InboundCallConfigEntity();
                inboundCallConfig.Id = id;
                inboundCallConfig.IsDeleted = true;
                this._inboundCallConfigRepo.deleteRecord(inboundCallConfig);
                resolve('Config successfully deleted');
            } else {
                reject("Unable to delete config");
            }
        });
    }
}
