import { Injectable } from '@nestjs/common';
import { FreeswitchConnectionResult } from 'src/helpers/fs-esl/inbound-esl.connection';
import { CallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.service';
import moment from 'moment';

@Injectable()
export class OutboundCallService {
    constructor(
        private readonly _callDetailRecordService : CallDetailRecordService
    ) {}

    async clickToCall(
        phoneNumberTo:string,
        phoneNumberFrom: string,
        callerId: string
    ): Promise<string>{

        return new Promise<string>( async (resolve,reject) => {

            let connectionResult = FreeswitchConnectionResult;

            if (!connectionResult.isSuccess){

                let message = 'Connection Error -> No ESL connection established!';

                console.log(message);

                reject(message);
            }
            else
            {
                let callUid: string;

                callUid = await this.triggerOriginateCall(
                    connectionResult.connectionObj,
                    phoneNumberFrom,
                    callerId
                );
        
                console.log('Originate CallUid -> ', callUid);

                this._callDetailRecordService.saveCDR({
                    UUID: callUid,
                    CallDirection: 'outbound',
                    StartedDate:  moment().format('YYYY-MM-DDTHH:mm:ss'),
                    PhoneNumberTo : phoneNumberTo
                });

                resolve(callUid);
            }
        });
    }

    async getPhoneNumberToByUUID(uuid:string):Promise<string>{
        
        return new Promise<string>( async (resolve) => {

            let retVal = await this._callDetailRecordService.getByCallUid(uuid);

            if (retVal != null){

                resolve(retVal.PhoneNumberTo);

                return;
            }

            resolve(null);
        });
    }

    private triggerOriginateCall(
        connection,
        phoneNumberFrom:string,
        callerId:string
    ): Promise<string>{

        return new Promise<string>((resolve,reject) => {

            let app_args = `sofia/gateway/fs-test1/${phoneNumberFrom}`;
            
            let arg1 = `{ignore_early_media=true,origination_caller_id_number=${callerId},hangup_after_bridge=true}${app_args}`;

            let arg4 = `${arg1} &socket(192.168.18.3:8000 async full)`;

            connection.api('originate', arg4 , function(result) {
                
                let callUid = result.getBody().toString().replace('+OK ', '').trim();

                console.log('originate', callUid);
        
                resolve(callUid.trim());
            });
        });
    }
}
