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
import { CustomAppLogger, ICustomAppLogger } from 'src/logger/customLogger';
import { WebhookParam } from './inbound-call/models/webhookParam';

export interface ConnResult {
  connectionObj?: any;
  isSuccess?: boolean;
  errorMessage?: string;
  callModel?: CallModel;
}

interface CallModel{
  calldDirection?:string;
  webhookParam: WebhookParam;
  voiceRequestParam: VoiceRequestParam;
  callRejected:boolean;
}

export const InboundEslConnResult: ConnResult = {
  connectionObj: null,
  isSuccess: false,
  errorMessage: null
};

export class InboundEslConnectionHelper {

  private readonly _logger = new CustomAppLogger(InboundEslConnectionHelper.name);

  constructor(
  ){}

  startConnection(){

    let fsConfig = new FreeswitchConfigHelper().getFreeswitchConfig();

    let connection = new esl.Connection(
      fsConfig.ip,
      fsConfig.port,
      fsConfig.password,
    );

    connection.on(FS_ESL.CONNECTION.ERROR, () => {
      InboundEslConnResult.errorMessage = 'Connection Error';
    });

    connection.on(FS_ESL.CONNECTION.READY, () => {
      this._logger.info('Esl Inbound Connection Ready!');
      InboundEslConnResult.isSuccess = true;
      InboundEslConnResult.connectionObj = connection;
      connection.subscribe('CHANNEL_HANGUP_COMPLETE');
      connection.subscribe('all');
      connection.subscribe('CHANNEL_CREATE');
    });

    this._onListenEvent(connection);

    connection.on('esl::end', () => {
      this._logger.info('Esl end.');
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

      console.log('HAAAANGUPPPPP');

      let callId = fsEvent.getHeader(CHANNEL_VARIABLE.UNIQUE_ID);
     
      let channelId = fsEvent.getHeader('Channel-Call-UUID');
      
      let cdrValues = new CDRHelper().getCallRecords(fsEvent);

      this._logger.info(`Call Direction : ${cdrValues.CallDirection}`);

      cdrValues.UUID = callId;

      if (callId === channelId){
        this._logger.info(`Call  : ${callId}`);
      }
      else{
        this._logger.info(`Call  : ${callId}`);
        this._logger.info(`Parent Call : ${callId}`);
        cdrValues.ParentCallUid = channelId;
      }
      // if (cdrValues.CallDirection === "outbound"){
      //   http.get(WebhookOutboundCallStatusCallBack(cdrValues));
      // }
      // else{
      //   http.get(WebhookInboundCallStatusCallBack(cdrValues));
      // }

        this._logger.info('HANDLE CALLS in inbound esl');
        this.statusCallback(cdrValues);
    });

    connection.on('esl::event::BACKGROUND_JOB::*', (evt) =>{
      console.log('BG - EVT -> ', evt);
    });
  }

  private statusCallback(cdrValues:CDRModel){

      this._logger.info(JSON.stringify(InboundEslConnResult.callModel));

      if (InboundEslConnResult.callModel !== undefined){

        if (!InboundEslConnResult.callModel.callRejected){

          let webhook = InboundEslConnResult.callModel.webhookParam;

          let params = InboundEslConnResult.callModel.voiceRequestParam;
  
          params.CallDirection = cdrValues.CallDirection;
          params.DialCallStatus = cdrValues.CallStatus;
          params.CallSid = cdrValues.UUID;
          params.DialCallDuration = cdrValues.Duration.toString();
  
          if (webhook.httpMethod === "POST"){
              axios.post(webhook.actionUrl, params);
          }
          else{
            axios.get(webhook.actionUrl, { params : params });
          }
        }
      }
  }
}
