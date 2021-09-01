import { FreeswitchCallSystemService } from "src/modules/freeswitch-call-system/services/freeswitch-call-system.service";
import { WebhookClickToCallStatusCallBack } from "src/utils/webhooks";
import { CHANNEL_VARIABLE } from "../constants/channel-variables.constants";
import { FS_ESL } from "../constants/fs-esl.constants";
import { CDRHelper } from "./cdr.helper";
import { FreeswitchConfigHelper } from "./freeswitchConfig.helper";
const esl = require('modesl');
const http = require('http');

interface ConnResult {
    connectionObj: any;
    isSuccess: boolean;
    errorMessage: string
}

export const FreeswitchConnectionResult: ConnResult = {
    connectionObj: null,
    isSuccess: false,
    errorMessage: null
}

export const fsConnect = (freeswitchCallSystemServicE: FreeswitchCallSystemService): any => {

    console.log('TRYING TO ESTABLISHED CONNECTION');
    
    let self = this;

    let fsConfig = new FreeswitchConfigHelper().getFreeswitchConfig();
        
    let connection = new esl.Connection(fsConfig.ip, 
        fsConfig.port, 
        fsConfig.password);
    
    connection.on(FS_ESL.CONNECTION.ERROR, () => {
        FreeswitchConnectionResult.errorMessage = "Connection Error";
      //  reject(FreeswitchConnectionResult);
    });

    connection.on(FS_ESL.CONNECTION.READY, () => {

        FreeswitchConnectionResult.isSuccess = true;
        FreeswitchConnectionResult.connectionObj = connection;
        connection.subscribe('all');
        connection.on('esl::event::*::*', async (fsEvent) => {
            const eventName = fsEvent.getHeader('Event-Name');

            console.log('EVENT NAME -> ', eventName);

            const callUid = fsEvent.getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

            console.log('uid - >', callUid);

            let dbCallUid = await freeswitchCallSystemServicE.getByCallId(callUid);

            if (eventName === 'CHANNEL_HANGUP_COMPLETE' &&
                dbCallUid) {

                console.log('LISTENING TO AN EVENT ', dbCallUid);
      
                let cdrModel = new CDRHelper().getCallRecords(fsEvent);
      
                console.log('CDR CLICKTOCALL', cdrModel);
                
                cdrModel.Id = dbCallUid.id;

                if (dbCallUid.CallDirection === 'Inbound'){
                    //call webhook inboundcall
                }
                else{
                    http.get(WebhookClickToCallStatusCallBack(cdrModel));
                }
            }
        });

    })
}

export class FreeswitchConnectionHelper{

    constructor(
        private readonly _freeswitchCallSystem : FreeswitchCallSystemService
    ){}

        startCon() {
             fsConnect(this._freeswitchCallSystem);
        }
}
