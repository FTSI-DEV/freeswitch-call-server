import { CallTypes } from '../constants/call-type';
import { CHANNEL_VARIABLE } from '../constants/channel-variables.constants';
import { EVENT_LIST } from '../constants/event-list.constants';
import { FS_ESL } from '../constants/fs-esl.constants';
import { CDRHelper } from './cdr.helper';
import { DTMFHelper } from './dtmf.helper';
import { FreeswitchConfigHelper } from './freeswitchConfig.helper';
import esl from 'modesl';
import http from 'http';
import { CDRModel } from 'src/modules/call-detail-record/models/cdr.models';
import moment from 'moment';
import { DialplanInstruction } from '../parser/xmlParser';
import axios from 'axios';
import { VoiceRequestParam } from './inbound-call/models/voiceRequestParam';

interface ConnResult {
  connectionObj: any;
  isSuccess: boolean;
  errorMessage: string;
  inboundCallModel?: InboundCall;
  outboundCallModel?:OutboundCall;
}

interface InboundCall{
  success:boolean;
  lastDialplanInstruction:DialplanInstruction;
  voiceRequestParam: VoiceRequestParam;
}

interface OutboundCall{
  success:boolean;
  lastDialplanInstruction:DialplanInstruction;
  voiceRequestParam: VoiceRequestParam;
}

export const FreeswitchConnectionResult: ConnResult = {
  connectionObj: null,
  isSuccess: false,
  errorMessage: null
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

    connection.on(FS_ESL.CONNECTION.ERROR, () => {
      FreeswitchConnectionResult.errorMessage = 'Connection Error';
    });

    connection.on(FS_ESL.CONNECTION.READY, () => {
      console.log('ESL INBOUND CONNECTION READY!');
      FreeswitchConnectionResult.isSuccess = true;
      FreeswitchConnectionResult.connectionObj = connection;
      connection.subscribe('CHANNEL_HANGUP_COMPLETE');
      connection.subscribe('all');
      connection.subscribe('CHANNEL_CREATE');
    });

    this._onListenEvent(connection);

    connection.on('esl::end', () => {
      console.log('ESL END ');
    })

    connection.on(FS_ESL.RECEIVED, (evt) => {

      let uid = evt.getHeader('Unique-ID');

      // if (uid != null){
      //   console.log('CHANNEL STATE ESL', evt.getHeader('Channel-State'));
      //   console.log(`ESL -> ${evt.getHeader('Event-Name')} , Uid -> ${uid}`
      //   );
      // }
    })
  }

  private _onListenEvent(connection){

    connection.on('esl::event::CHANNEL_CREATE::*', (fsEvent) => {

      let eventName = fsEvent.getHeader('Event-Name');

      let callId = fsEvent.getHeader(CHANNEL_VARIABLE.UNIQUE_ID);
      
      let callDirection = fsEvent.getHeader(CHANNEL_VARIABLE.CALL_DIRECTION);

      if (callDirection === CallTypes.Inbound){

        console.log('Call direction -> ' ,callDirection);
        console.log('Call Id -> ', callId);
        console.log('Event Name -> ', eventName);

        let cdrValues: CDRModel = {
          UUID: callId,
          CallDirection: callDirection,
          StartedDate : moment().format('YYYY-MM-DDTHH:mm:ss')
        }

        // http.get(WebhookInboundCallStatusCallBack(cdrValues));
      }
    });

    connection.on('esl::event::CHANNEL_HANGUP_COMPLETE::*', (fsEvent) => {

      let callId = fsEvent.getHeader(CHANNEL_VARIABLE.UNIQUE_ID);
     
      let channelId = fsEvent.getHeader('Channel-Call-UUID');
      
      let cdrValues = new CDRHelper().getCallRecords(fsEvent);

      console.log('Call direction ', cdrValues.CallDirection);

      cdrValues.UUID = callId;

      if (callId === channelId){
        console.log('Call : ' , callId);
      }
      else{
        console.log('Call : ' , callId);
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
    });
  }

  private statusCallback(cdrValues:CDRModel){
      if (FreeswitchConnectionResult.inboundCallModel !== undefined){

        let lastDPInstruction = FreeswitchConnectionResult.inboundCallModel.lastDialplanInstruction;

        let params = FreeswitchConnectionResult.inboundCallModel.voiceRequestParam;

        params.CallDirection = cdrValues.CallDirection;
        params.DialCallStatus = cdrValues.CallStatus;
        params.CallSid = cdrValues.UUID;
        params.DialCallDuration = cdrValues.Duration.toString();

        if (lastDPInstruction.dialAttribute.method === "POST"){
            axios.post(lastDPInstruction.dialAttribute.action, params);
        }
        else{
          axios.get(lastDPInstruction.dialAttribute.action, { params : params });
        }

        console.log('SUCCESSFULLY END incoming call');
    }
    else if (FreeswitchConnectionResult.outboundCallModel !== undefined){

      let lastDPInstruction = FreeswitchConnectionResult.outboundCallModel.lastDialplanInstruction;

      let params = FreeswitchConnectionResult.outboundCallModel.voiceRequestParam;

      params.CallDirection = cdrValues.CallDirection;
      params.DialCallStatus = cdrValues.CallStatus;
      params.CallSid = cdrValues.UUID;
      params.DialCallDuration = cdrValues.Duration.toString();

        if (lastDPInstruction.dialAttribute.method === "POST"){
          axios.post(lastDPInstruction.dialAttribute.action, params);
        }
        else{
          axios.get(lastDPInstruction.dialAttribute.action, { params : params });
        }
    }
  }
}
