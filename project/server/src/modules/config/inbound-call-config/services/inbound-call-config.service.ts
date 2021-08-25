import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FreeswitchCallConfig, FreeswitchCallConfigRepository } from 'src/entity/freeswitchCallConfig.entity';
import { InboundCallConfig, InboundCallConfigRepository } from 'src/entity/inboundCallConfig.entity';
import { INBOUND_CALL_CONFIG } from 'src/helpers/constants/call-config.constants';
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
