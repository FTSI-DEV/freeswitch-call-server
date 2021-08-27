import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CONNREFUSED } from 'dns';
import { CDRModels } from 'src/models/cdr.models';
import { InboundCallConfigService } from 'src/modules/config/inbound-call-config/services/inbound-call-config.service';
import apiClient from 'src/utils/apiClient';
import { WebhookIncomingStatusCallBack } from 'src/utils/webhooks';
import { EVENT_LIST } from '../constants/event-list.constants';
import { ESL_SERVER, FS_DIALPLAN, FS_ESL } from '../constants/fs-esl.constants';
import { TwiMLContants } from '../constants/twiml.constants';
import { KeyValues, XMLParser } from '../parser/twimlXML.parser';
import { CDRHelper } from './cdr.helper';
const http = require('http');

let eslServerRes = null;

let CDR = null;
let callerDesinationNumber = null;

export class EslServerHelper {
  constructor(
    private readonly _inboundCallConfig: InboundCallConfigService,
    private readonly _callRecords = new CDRHelper(),
  ) {}

  //for InboundCall
  startEslServer() {
    let esl = require('modesl');

    let esl_server = new esl.Server(
      {
        port: process.env.ESL_SERVER_PORT,
        host: process.env.ESL_SERVER_HOST,
        myevents: true,
      },

      function () {
        console.log('esl server is up');
      },
    );

    eslServerRes = esl_server;

    this.inboundCallEnter();
  }

  private _onListen(conn: any): any {

    conn.on(FS_ESL.RECEIVED, (fsEvent) => {

        const eventName = fsEvent.getHeader(EVENT_LIST.EVENT_NAME);

        console.log('EVEN-NAME -> ', eventName);

        if (eventName === EVENT_LIST.CHANNEL_EXECUTE || eventName === EVENT_LIST.CHANNEL_CREATE){

          callerDesinationNumber = this._callRecords.getCallerDestinationNumber(fsEvent);

          console.log('CALLER-DESTINATION-NUMBER' , callerDesinationNumber);
        }

        if (eventName === EVENT_LIST.CHANNEL_HANGUP || eventName === EVENT_LIST.CHANNEL_HANGUP_COMPLETE){
          CDR = this._callRecords.getCallRecords(fsEvent);

          console.log('CALL-RECORD', CDR);

          return CDR;
        }
    });
  }

  private inboundCallEnter(): any {
    let self = this;

    eslServerRes.on(ESL_SERVER.CONNECTION.READY, function (conn) {
      console.log('CONNECTION SERVER READY');

      self._onListen(conn);

      let eslInfo = conn.getInfo();

      let destinationNumber = eslInfo.getHeader('Caller-Destination-Number');

      console.log('dest', destinationNumber);

      self.inboundCallExecute(conn, destinationNumber);

      conn.on('esl::end', function (evt, body) {
        console.log('ESL END');
        console.log('CDR - END', CDR);

        http.get(WebhookIncomingStatusCallBack(CDR), function (res) {});
      });
    });
  }

  private inboundCallExecute(conn, callerId: string) {
    let self = this;

    self._inboundCallConfig.getInboundConfigCallerId(callerId)
    .then((result) => {

      if (result == null || result == undefined){
        conn.execute('playback', 'ivr/ivr-call_cannot_be_completed_as_dialed');
      }

      console.log('fs inbound call config', result);

      let apiRetVal =  this.triggerWebhookURL(result);

      apiRetVal.then((result) => {
        
        console.log('record crm api', result);

        if (result != null){
          let phoneNumberTo = result.PhoneNumberTo;

          conn.execute('bridge', `sofia/gateway/sip_provider/${phoneNumberTo}`);
        }

      }).catch((err) => {
        console.log('UNEXPECTED ERROR CALLING API -> ', err);
      });
      
      this.triggerIncomingStatusCallBack(CDR);

    }).catch((err) => {
      console.log('UNEXPECTED ERROR -> ', err);
    });
  }

  private triggerIncomingStatusCallBack(cdrModel: CDRModels){

    if (cdrModel == null || cdrModel == undefined) return;

    http.get(WebhookIncomingStatusCallBack(cdrModel));
  }

  private triggerWebhookURL(result):any{

    let record = null;

    let webhookurl = result.webhookUrl;
      
    let httpMethod = result.httpMethod;

    if (httpMethod == "POST")
    {
      record =  axios.post(webhookurl);
    }
    else if (httpMethod == "GET")
    {
      console.log('webhook URL', webhookurl);
      record = axios.get(webhookurl);
    }

    return record;
  }

  private _executeTestCrmApi(conn: any) {
    console.log('EXECUTING CRM API -> ');

    apiClient
      .getIncomingCallEnter({
        StoreId: 60,
        SystemId: 1,
      })
      .then((res) => {
        let xmlParserResult = new XMLParser().tryParseXMLBody(res.data);

        let dialplan_taskList = this.XmlConversionTaskValues(xmlParserResult);

        dialplan_taskList.forEach((element) => {
          console.log(`Key: ${element.key} , Value: ${element.value}`);

          if (element.key === FS_DIALPLAN.Say) {
            element.value = 'ivr/ivr-welcome_to_freeswitch.wav';
            element.key = 'playback';
          }

          conn.execute(element.key, element.value);
        });
      })
      .catch((err) => console.log('UNEXPECTED ERROR -> ', err));
  }

  private XmlConversionTaskValues(xmlParserResult: KeyValues[]): KeyValues[] {
    let freeswitchTaskListKeyValues: KeyValues[] = [];

    xmlParserResult.forEach((element) => {
      let newKeyValue = <KeyValues>{};

      newKeyValue.value = element.value;

      if (element.key === TwiMLContants.Say) {
        newKeyValue.key = FS_DIALPLAN.Say;

        freeswitchTaskListKeyValues.push(newKeyValue);
      } else if (element.key === TwiMLContants.Dial) {
        newKeyValue.key = FS_DIALPLAN.Dial;

        freeswitchTaskListKeyValues.push(newKeyValue);
      }
    });

    return freeswitchTaskListKeyValues;
  }
}
