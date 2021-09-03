import { Console } from 'console';
import { FsCallDetailRecordEntity } from 'src/entity/freeswitchCallDetailRecord.entity';
import { FreeswitchCallSystemService } from 'src/modules/freeswitch-call-system/services/freeswitch-call-system.service';
import { WebhookInboundCallStatusCallBack, WebhookOutboundCallStatusCallBack } from 'src/utils/webhooks';
import { CallTypes } from '../constants/call-type';
import { CHANNEL_VARIABLE } from '../constants/channel-variables.constants';
import { FS_ESL } from '../constants/fs-esl.constants';
import { CDRHelper } from './cdr.helper';
import { FreeswitchConfigHelper } from './freeswitchConfig.helper';
const esl = require('modesl');
const http = require('http');

interface ConnResult {
  connectionObj: any;
  isSuccess: boolean;
  errorMessage: string;
}

export const FreeswitchConnectionResult: ConnResult = {
  connectionObj: null,
  isSuccess: false,
  errorMessage: null,
};

export class InboundEslConnectionHelper {
  constructor(
    private readonly _freeswitchCallSystemService: FreeswitchCallSystemService,
  ) {}

  startConnection(){

    console.log('TRYING TO ESTABLISHED CONNECTION');
  
    let fsConfig = new FreeswitchConfigHelper().getFreeswitchConfig();
  
    let connection = new esl.Connection(
      fsConfig.ip,
      fsConfig.port,
      fsConfig.password,
    );

    connection.on(FS_ESL.CONNECTION.ERROR, () => {
      console.log('ESL INBOUND CONNECTION ERROR!');
      FreeswitchConnectionResult.errorMessage = 'Connection Error';
    });
  
    connection.on(FS_ESL.CONNECTION.READY, () => {
      console.log('ESL INBOUND CONNECTION READY!');
      FreeswitchConnectionResult.isSuccess = true;
      FreeswitchConnectionResult.connectionObj = connection;
      connection.subscribe('all');
      this._onListenEvent(connection);
    });
  }

  private _onListenEvent(connection){

    connection.on('esl::event::CHANNEL_HANGUP_COMPLETE::**', async (fsEvent) => {

      const eventName = fsEvent.getHeader('Event-Name');

      console.log('EVENT NAME -> ', eventName);

      const callUid = fsEvent.getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

      console.log('uid - >', callUid);

      if (eventName === 'CHANNEL_HANGUP_COMPLETE') {

        let parentCall = await this._freeswitchCallSystemService.getByCallUid(callUid);
      
        if (parentCall != null)
          await this.savedParentCall(fsEvent, parentCall);
        else
          this.savedChildCall(fsEvent, callUid);
      }
    });
  }

  private async savedParentCall(fsEvent:any,parentCall: FsCallDetailRecordEntity){

    let cdrModel = new CDRHelper().getCallRecords(fsEvent);

    cdrModel.Id = parentCall.id;

    if (parentCall.CallDirection === CallTypes.Inbound) {
      http.get(WebhookInboundCallStatusCallBack(cdrModel));
    } 
    else {
      http.get(WebhookOutboundCallStatusCallBack(cdrModel));
    }
  }

  private savedChildCall(fsEvent, callUid:string){

    let originator = fsEvent.getHeader('variable_originator');
          
    let cdrModel = new CDRHelper().getCallRecords(fsEvent);

    cdrModel.ParentCallUid = originator;
    
      console.log('CHILD CALL -> ', callUid);

      console.log('CALL DIRECTION -> ' ,cdrModel.CallDirection);

      if (cdrModel.CallDirection === CallTypes.Inbound){
        http.get(WebhookInboundCallStatusCallBack(cdrModel));
      }
      else
      {
        http.get(WebhookOutboundCallStatusCallBack(cdrModel));
      }
  }
}
