import { Console } from 'console';
import { FsCallDetailRecordEntity } from 'src/entity/call-detail-record';
import { CallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.service';
import { WebhookInboundCallStatusCallBack, WebhookOutboundCallStatusCallBack } from 'src/utils/webhooks';
import { CallTypes } from '../constants/call-type';
import { CHANNEL_VARIABLE } from '../constants/channel-variables.constants';
import { EVENT_LIST } from '../constants/event-list.constants';
import { FS_ESL } from '../constants/fs-esl.constants';
import { CDRHelper } from './cdr.helper';
import { DTMFHelper } from './dtmf.helper';
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

  startConnection(){

    console.log('TRYING TO ESTABLISHED CONNECTION');

    let fsConfig = new FreeswitchConfigHelper().getFreeswitchConfig();

    let connection = new esl.Connection(
      fsConfig.ip,
      fsConfig.port,
      fsConfig.password,
    );

    let dtmf = new DTMFHelper();

    connection.on(FS_ESL.CONNECTION.ERROR, () => {
      // console.log('ESL INBOUND CONNECTION ERROR!');
      FreeswitchConnectionResult.errorMessage = 'Connection Error';
    });

    connection.on(FS_ESL.CONNECTION.READY, () => {
      console.log('ESL INBOUND CONNECTION READY!');
      FreeswitchConnectionResult.isSuccess = true;
      FreeswitchConnectionResult.connectionObj = connection;
      connection.subscribe('CHANNEL_HANGUP_COMPLETE');
      connection.subscribe('CHANNEL_ANSWER');
      connection.subscribe('DTMF');
      connection.subscribe('BACKGROUND_JOB');
    });

    this._onListenEvent(connection, dtmf);

    connection.on('esl::end', () => {
      console.log('ESL END ');
    })
  }

  private _onListenEvent(connection, dtmf: DTMFHelper){

    connection.on('esl::event::CHANNEL_HANGUP_COMPLETE::**', (fsEvent) => {

      console.log('EVENT-NAME ->' , fsEvent.getHeader(EVENT_LIST.EVENT_NAME));

      let callId = fsEvent.getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

      let channelId = fsEvent.getHeader('Channel-Call-UUID');

      console.log('CHANNEL ID -> ', channelId);

      let cdrValues = new CDRHelper().getCallRecords(fsEvent);

      cdrValues.UUID = callId;

      if (callId === channelId){
        console.log('Call : ' , callId);
      }
      else{
        console.log('Call : ' , callId);
        dtmf.stopDTMF(connection, callId);
        cdrValues.ParentCallUid = channelId;
        console.log('Parent Call : ', channelId);
      }

      // if (cdrValues.CallDirection === "outbound"){
      //   http.get(WebhookOutboundCallStatusCallBack(cdrValues));
      // }
      // else{
      //   http.get(WebhookInboundCallStatusCallBack(cdrValues));
      // }

    });

    connection.on('esl::event::BACKGROUND_JOB::*', (evt) =>{
      console.log('BG - EVT -> ', evt);
    })

    connection.on('esl::event::CHANNEL_ANSWER::**', (evt) => {

      console.log('EVENT-NAME ->' , evt.getHeader(EVENT_LIST.EVENT_NAME));

      let callId = evt.getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

      let channelId = evt.getHeader('Channel-Call-UUID');

      // connection.bgapi('sofia status', (res) => {
      //   console.log('SOFIA STATUS -> ' , res);
      // });

      // connection.bgapi('show calls', (res) => {

      //   let jobUUID = res.getHeader('Job-UUID');

      //   console.log('show calls -> ' , jobUUID);

      //   console.log('ALL -> ', res);
      // });

      // console.log('CHANNEL ID -> ', channelId);

      // if (callId === channelId){
      //   console.log('Call : ' , callId);
      // }
      // else{
      //   console.log('Call : ' , callId);
      //   console.log('Parent Call : ', channelId);
      //   dtmf.startDTMF(connection, callId);
      //   dtmf.captureDTMF(connection, callId);
      // }
    });
  }
}
