import { WebhookInboundCallStatusCallBack, WebhookOutboundCallStatusCallBack } from 'src/utils/webhooks';
import { CallTypes } from '../constants/call-type';
import { CHANNEL_VARIABLE } from '../constants/channel-variables.constants';
import { EVENT_LIST } from '../constants/event-list.constants';
import { FS_ESL } from '../constants/fs-esl.constants';
import { CDRHelper } from './cdr.helper';
import { DTMFHelper } from './dtmf.helper';
import { FreeswitchConfigHelper } from './freeswitchConfig.helper';
import esl from 'modesl';
import http from 'http';

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

    connection.on(FS_ESL.RECEIVED, (evt) => {

      let uid = evt.getHeader('Unique-ID');

      if (uid != null){
        console.log('CHANNEL STATE ESL', evt.getHeader('Channel-State'));
        console.log(
          `ESL -> ${evt.getHeader('Event-Name')} , 
          Uid -> ${uid}`
        );
      }
    })
  }

  private _onListenEvent(connection, dtmf: DTMFHelper){

    connection.on('esl::event::CHANNEL_HANGUP_COMPLETE::**', (fsEvent) => {

      let callId = fsEvent.getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

      console.log('ESL EVTNAME ->' , fsEvent.getHeader(EVENT_LIST.EVENT_NAME));
      console.log('ESL legid ->' , callId);
     
      let channelId = fsEvent.getHeader('Channel-Call-UUID');
      
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
