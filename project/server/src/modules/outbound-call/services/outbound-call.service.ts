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

            let app_args = `sofia/gateway/fs-test3/${phoneNumberFrom}`;
            
            let arg1 = `{ignore_early_media=true,origination_caller_id_number=${phoneNumberFrom},hangup_after_bridge=true}${app_args}`;
           
            let arg2 = `${arg1} &bridge({origination_caller_id_number=${callerId}}sofia/gateway/fs-test1/${phoneNumberTo})`;
            
            let arg3 = `bridge({hangup_after_bridge=true,origination_caller_id_number=${callerId}}sofia/gateway/fs-test1/${phoneNumberTo})`

            connection.api('originate', arg2 , function(result) {
                
                let callUid = result.getBody().toString().replace('+OK ', '').trim();

                connection.execute('record_session', '$${recordings_dir}/${strftime(%Y-%m-%d-%H-%M-%S)}_${uuid}_${caller_id_number}.wav', callUid);

                console.log('originate', callUid);
        
                resolve(callUid.trim());
            });
        });
    }
}
