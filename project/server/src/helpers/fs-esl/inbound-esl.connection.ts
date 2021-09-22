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
import { VoiceRequestParam } from './models/voiceRequestParam';

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
      connection.subscribe('all');
      connection.subscribe('CHANNEL_CREATE');
      connection.subscribe('CHANNEL_STATE');
    });

    this._onListenEvent(connection, dtmf);

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

  private _onListenEvent(connection, dtmf: DTMFHelper){

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

    connection.on('esl::event::CHANNEL_STATE::*', (fsEvent) => {

      let callId = fsEvent.getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

      let channelId = fsEvent.getHeader('Channel-Call-UUID');
      
      let cdrValues = new CDRHelper().getCallRecords(fsEvent);

      cdrValues.UUID = callId;

      console.log('CS STATE');

      if (callId === channelId){
        console.log('Call : ' , callId);
      }
      else{
        console.log('Call : ' , callId);
        dtmf.stopDTMF(connection, callId);
        cdrValues.ParentCallUid = channelId;
        console.log('Parent Call : ', channelId);
      }

    });

    connection.on('esl::event::CHANNEL_HANGUP_COMPLETE::*', (fsEvent) => {

      let callId = fsEvent.getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

      // console.log('ESL EVTNAME ->' , fsEvent.getHeader(EVENT_LIST.EVENT_NAME));
      // console.log('ESL legid ->' , callId);
     
      let channelId = fsEvent.getHeader('Channel-Call-UUID');
      
      let cdrValues = new CDRHelper().getCallRecords(fsEvent);

      console.log('CHANNEL HANGUP COMPLETE ');

      console.log('Call direction ', cdrValues.CallDirection);

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
