import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FreeswitchCallConfig, FreeswitchCallConfigRepository } from 'src/entity/freeswitchCallConfig.entity';
import { INBOUND_CALL_CONFIG } from 'src/helpers/constants/call-config.constants';
import { InboundCallConfigModel, InboundCallConfigParam } from '../models/inbound-call-config.model';

@Injectable()
export class InboundCallConfigService {

    constructor(
        @InjectRepository(FreeswitchCallConfig)
        private _freeswitchConfigRepo : FreeswitchCallConfigRepository
    ) {}

    add(inboundCallConfig: InboundCallConfigParam){

        let inboundConfig = new FreeswitchCallConfig();

        inboundConfig.Value = JSON.stringify(inboundCallConfig);
        inboundConfig.Name = `${INBOUND_CALL_CONFIG}:${inboundCallConfig.callForwardingNumber}`;

        this._freeswitchConfigRepo.saveUpdateRecord(inboundConfig);
    }

    update(inboundCallConfig: InboundCallConfigParam):boolean{
        
        let inboundConfig = this.getRecordByPhoneNumber(inboundCallConfig.callForwardingNumber);

        if (inboundCallConfig == null) return false;

        let value = JSON.parse(inboundConfig.Value);

        if (value == null) return false;

        value.phoneNumberTo = inboundCallConfig.phoneNumberTo;
        value.callForwardingNumber = inboundCallConfig.callForwardingNumber;
        value.callerId = inboundCallConfig.callerId;

        let serializeObj = JSON.stringify(value);

        inboundConfig.Value = serializeObj;

        this._freeswitchConfigRepo.saveUpdateRecord(inboundConfig);
    }

    getInboundCallByPhoneNumber(callForwardingNumber:string) :any {

        return new Promise<InboundCallConfigModel>((resolve, reject) => {
            let record = this.getRecordByPhoneNumber(callForwardingNumber)
                .then((result) => {

                    if (result == null) reject(null);

                    let value = JSON.parse(result.Value);

                    if (value == null) reject(null);

                    let retVal = new InboundCallConfigModel();
                    retVal.callForwardingNumber = value.callForwardingNumber;
                    retVal.callerId = value.callerId;
                    retVal.phoneNumberTo = value.phoneNumberTo;

                    resolve(retVal);
                }).catch((err) => {
                    reject(null);
                });
        })
    }

    private getRecordByPhoneNumber = (callForwardingNumber:string): any => {

        return new Promise<FreeswitchCallConfig>((resolve,reject) => {
           
            let name = `${INBOUND_CALL_CONFIG}:${callForwardingNumber}`;

            let record = this._freeswitchConfigRepo.createQueryBuilder("public.FreeswitchCallConfig")
                .where("public.FreeswitchCallConfig.Name = :name", { name : name })
                .getOneOrFail()
                .then(result => {
                   if (result == null){
                       reject(null);
                   }
                   else {
                       console.log('data', result);
                       resolve(result);
                   }
                })
                .catch(error => {
                    reject(null);
                });
        })
    }

}
