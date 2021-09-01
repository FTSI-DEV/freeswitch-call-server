import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CONNREFUSED } from 'dns';
import { CustomLogger } from 'src/logger/logger';
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
const esl = require('modesl');

let eslServerRes = null;

let CDR = null;
let callerDesinationNumber = null;

export class EslServerHelper {

  // private readonly _logger = new CustomLogger(EslServerHelper.name);
  // private readonly _customLogger = getLog(EslServerHelper.name);

  private readonly _customLogger = new CustomLogger(EslServerHelper.name);

  constructor(
    private readonly _inboundCallConfig: InboundCallConfigService,
    private readonly _callRecords = new CDRHelper(),
  ) {}

  //for InboundCall
  startEslServer() {

    this._customLogger.info('Start esl Server..');

    let self = this;

    let esl_server = new esl.Server(
      {
        port: process.env.ESL_SERVER_PORT,
        host: process.env.ESL_SERVER_HOST,
        myevents: true,
      },

      function () {
        // self._customLogger.info('Esl Server is up!');

        self._customLogger.getLog(EslServerHelper.name).info('Esl server is up');
      },
    );

    eslServerRes = esl_server;

    this.inboundCallEnter();
  }

  private _onListen(conn: any): any {
    conn.on(FS_ESL.RECEIVED, (fsEvent) => {
      const eventName = fsEvent.getHeader(EVENT_LIST.EVENT_NAME);

      if (eventName === EVENT_LIST.CHANNEL_EXECUTE || eventName === EVENT_LIST.CHANNEL_CREATE){
        callerDesinationNumber = this._callRecords.getCallerDestinationNumber(fsEvent);
      }

      if (eventName === EVENT_LIST.CHANNEL_HANGUP || eventName === EVENT_LIST.CHANNEL_HANGUP_COMPLETE){
        CDR = this._callRecords.getCallRecords(fsEvent);
      }
    });
  }

  private inboundCallEnter() {
    let self = this;

    eslServerRes.on(ESL_SERVER.CONNECTION.READY, function (conn) {

      conn.subscribe('events::all');

      // Event channel observer
      self._onListen(conn);

      let eslInfo = conn.getInfo();

      let destinationNumber = eslInfo.getHeader('Caller-Destination-Number');

      self.inboundCallExecute(conn, destinationNumber);

      conn.on('esl::end', function() {
        self.triggerIncomingStatusCallBack(CDR);
      });
    });
  }

  private inboundCallExecute(conn, callerId: string) {
    let self = this;

    self._inboundCallConfig.getInboundConfigCallerId(callerId)
    .then( async (result) => {

      if (!result) conn.execute('playback', 'ivr/ivr-call_cannot_be_completed_as_dialed');
      
      let apiRetVal = await this.triggerWebhookURL(result);

      if (apiRetVal) {

        // XML PARSER
        console.log('apiRetVal: ', apiRetVal);
     
      }
      
    }).catch((err) => {
      console.log('UNEXPECTED ERROR -> ', err);
    });
  }

  private triggerIncomingStatusCallBack(cdrModel: CDRModels){
    http.get(WebhookIncomingStatusCallBack(cdrModel));
  }

  async triggerWebhookURL(result) {
    const { webhookUrl, httpMethod } = result;
    let record = null;
    if ( httpMethod == "POST" ) {
      record = await axios.post(webhookUrl);
    } else {
      record = await axios.get(webhookUrl);
    }
    return record.data;
  }

  private _executeTestCrmApi(conn: any) {
    console.log('EXECUTING CRM API -> ');

    // apiClient
    //   .getIncomingCallEnter({
    //     StoreId: 60,
    //     SystemId: 1,
    //   })
    //   .then((res) => {
    //     let xmlParserResult = new XMLParser().tryParseXMLBody(res.data);

    //     let dialplan_taskList = this.XmlConversionTaskValues(xmlParserResult);

    //     dialplan_taskList.forEach((element) => {
    //       console.log(`Key: ${element.key} , Value: ${element.value}`);

    //       if (element.key === FS_DIALPLAN.Say) {
    //         element.value = 'ivr/ivr-welcome_to_freeswitch.wav';
    //         element.key = 'playback';
    //       }

    //       conn.execute(element.key, element.value);
    //     });
    //   })
    //   .catch((err) => console.log('UNEXPECTED ERROR -> ', err));
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
