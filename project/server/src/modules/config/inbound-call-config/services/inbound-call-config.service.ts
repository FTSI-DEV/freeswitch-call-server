import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { resolve } from 'path';
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

        inboundCallConfig.CallForwardingNumber = param.callForwardingNumber;
        inboundCallConfig.CallerId = param.callerId;
        inboundCallConfig.PhoneNumberTo = param.phoneNumberTo;

        this._inboundCallConfigRepo.saveUpdateRecord(inboundCallConfig);
    }

    update(param: InboundCallConfigParam):boolean{

        this.getRecordById(param.id)
        .then((result) => {

            if (result == null || result == undefined)  return false;

            result.CallerId = param.callerId;
            result.CallForwardingNumber = param.callForwardingNumber;
            result.PhoneNumberTo = param.phoneNumberTo;
            this._inboundCallConfigRepo.saveUpdateRecord(result);
        })
        .catch(err => {
            return false;
        });

        return true;
    }

    getInboundCallConfigByCallForwardingNo(callForwardingNumber: string) : any {
        return new Promise<InboundCallConfigModel>((resolve, reject) => {
            this.getConfigByCallForwardingNumber(callForwardingNumber)
            .then((result) => {
                if (result == null || result == undefined) reject(null);

                let retVal = new InboundCallConfigModel();
                retVal.callerId = result.CallerId;
                retVal.callForwardingNumber = result.CallForwardingNumber;
                retVal.phoneNumberTo = result.PhoneNumberTo;

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
                        phoneNumberTo: result.PhoneNumberTo,
                        callForwardingNumber: result.CallForwardingNumber,
                        callerId: result.CallForwardingNumber,
                        id: result.Id
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

                    configModel.callForwardingNumber = element.CallForwardingNumber;
                    configModel.callerId = element.CallerId;
                    configModel.phoneNumberTo = element.PhoneNumberTo;
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

    private getConfigByCallForwardingNumber = (callForwardingNumber:string) : any => {
        return new Promise<InboundCallConfig>((resolve,reject) => {
            
            this._inboundCallConfigRepo.createQueryBuilder("public.InboundCallConfig")
                .where("public.InboundCallConfig.CallForwardingNumber = :callForwardingNumber" , { callForwardingNumber : callForwardingNumber })
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
