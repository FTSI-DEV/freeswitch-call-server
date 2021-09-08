import { Injectable } from '@nestjs/common';
import { FreeswitchConnectionResult } from 'src/helpers/fs-esl/inbound-esl.connection';

@Injectable()
export class OutboundCallService {
    constructor() {}

    async clickToCall(
        phoneNumberTo:string,
        phoneNumberFrom: string,
        callerId: string
    ): Promise<string>{

        let callUid: string;

        let connectionResult = FreeswitchConnectionResult;

        if (!connectionResult.isSuccess){
            console.log('Connection Error -> No ESL connection established!');
            return "Connection Error -> No ESL Connection established!";
        }

        callUid = await this.triggerOriginateCall(
            connectionResult.connectionObj,
            phoneNumberFrom,
            phoneNumberTo,
            callerId
        );

        console.log('Originate CallUid -> ', callUid);

        return new Promise<string>((resolve,reject) => {
            resolve(callUid);
        });
    }

    private triggerOriginateCall(
        connection,
        phoneNumberFrom:string,
        phoneNumberTo:string,
        callerId:string
    ): Promise<string>{

        return new Promise<string>((resolve,reject) => {

            let app_args = `sofia/gateway/fs-test1/${phoneNumberFrom}`;
            
            let arg1 = `{ignore_early_media=true,origination_caller_id_number=${phoneNumberFrom},hangup_after_bridge=true}${app_args}`;

            let arg4 = `${arg1} &socket(192.168.18.3:8000 async full)`;

            connection.api('originate', arg4 , function(result) {
                
                let callUid = result.getBody().toString().replace('+OK ', '').trim();

                console.log('originate', callUid);
        
                resolve(callUid.trim());
            });
        });
    }
}
