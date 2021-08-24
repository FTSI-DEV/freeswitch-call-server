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
        inboundConfig.Name = `${INBOUND_CALL_CONFIG}:${inboundCallConfig.phoneNumberTo}`;

        this._freeswitchConfigRepo.saveUpdateRecord(inboundConfig);
    }

    update(inboundCallConfig: InboundCallConfigParam):boolean{
        
        let inboundConfig = this.getRecordByPhoneNumber(inboundCallConfig.phoneNumberTo);

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

    getInboundCallByPhoneNumber(phoneNumberFrom: string):InboundCallConfigModel{
        let record =  this.getRecordByPhoneNumber(phoneNumberFrom);

        if (record == null) return null;

        let value = JSON.parse(record.Value);

        if (value == null) return null;

        return{
            callForwardingNumber: value.callForwardingNumber,
            phoneNumberTo: value.phoneNumberTo,
            callerId: value.callerId,
        };
    }
    
    private getRecord() {
        
        let record = this._freeswitchConfigRepo.findOne()
    }

    private getRecordByPhoneNumber = (phoneNumberTo:string): any => {
        return new Promise<FreeswitchCallConfig>((resolve,reject) => {
           
            let name = `${INBOUND_CALL_CONFIG}:${phoneNumberTo}`;

            let record = this._freeswitchConfigRepo.createQueryBuilder("public.FreeswitchCallConfig")
                .where("public.FreeswitchCallConfig.Name = :name", { name : name })
                .getOneOrFail()
                .then(result => {
                   if (result == null){
                       reject(null);
                   }
                   else {
                       resolve(result);
                   }
                })
                .catch(error => {
                    reject(null);
                });
        })
    }

}
