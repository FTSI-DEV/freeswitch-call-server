import { Inject, Injectable } from '@nestjs/common';
import { InboundEslConnResult } from 'src/helpers/fs-esl/inbound-esl.connection';
import { CALL_DETAIL_RECORD_SERVICE, ICallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.interface';
import { TimeProvider } from 'src/utils/timeProvider.utils';
import { IOutboundCallService } from './outbound-call.interface';

@Injectable()
export class OutboundCallService implements IOutboundCallService{
    constructor(
        @Inject(CALL_DETAIL_RECORD_SERVICE)
        private readonly _callDetailRecordService : ICallDetailRecordService
    ) {}

    async clickToCall(
        phoneNumberTo:string,
        phoneNumberFrom: string,
        callerId: string
    ): Promise<string>{

        return new Promise<string>( async (resolve,reject) => {

            let connectionResult = InboundEslConnResult;

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

                // this._callDetailRecordService.saveCDR({
                //     UUID: callUid,
                //     CallDirection: 'outbound',
                //     StartedDate:  new TimeProvider().getDateTimeNow(),
                //     PhoneNumberTo : phoneNumberTo
                // });

                // resolve(callUid);
            }
        });
    }

    private triggerOriginateCall(
        connection,
        phoneNumberFrom:string,
        callerId:string
    ): Promise<string>{

        return new Promise<string>((resolve,reject) => {

            let app_args = `sofia/gateway/fs-test1/1000`;
            
            let arg1 = `{ignore_early_media=true,origination_caller_id_number=1000,hangup_after_bridge=true,call_timeout=10}${app_args}`;

            let arg4 = `${arg1} &socket(192.168.18.3:8000 async full)`;

            connection.api('originate', arg4 , function(result) {
                
                let callUid = result.getBody().toString().replace('+OK ', '').trim();

                console.log('originate', callUid);
        
                resolve(callUid.trim());
            });
        });
    }
}
