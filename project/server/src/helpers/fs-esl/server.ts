import { Injectable } from '@nestjs/common';
import { InboundCallConfigService } from 'src/modules/config/inbound-call-config/services/inbound-call-config.service';
import apiClient from 'src/utils/apiClient';
import { WebhookIncomingStatusCallBack } from 'src/utils/webhooks';
import { FS_DIALPLAN, FS_ESL } from '../constants/fs-esl.constants';
import { TwiMLContants } from '../constants/twiml.constants';
import { KeyValues, XMLParser } from '../parser/twimlXML.parser';
import { CDRHelper } from './cdr.helper';
const http = require('http');

let eslServerRes = null;

let CDR = null;
let callerId = null;

export class EslServerHelper {
  constructor(
    private readonly _inboundCallConfig: InboundCallConfigService,
    private readonly _callRecords = new CDRHelper(),
  ) {}

  private _onListen(conn: any): any {
    conn.on(FS_ESL.RECEIVED, (fsEvent) => {
      const eventName = fsEvent.getHeader('Event-Name');

      console.log('LISTENING TO AN EVENT ->', eventName);

      if (eventName === 'CHANNEL_EXECUTE' || eventName === 'CHANNE_CREATE') {
        callerId = this._callRecords.getCallerId(fsEvent);
        console.log('CALLERID ', callerId);
      }

      if (
        eventName === 'CHANNEL_HANGUP_COMPLETE' ||
        eventName === 'CHANNEL_HANGUP'
      ) {
        let call_record = this._callRecords.getCallRecords(fsEvent);

        console.log('CALL-RECORD', call_record);

        CDR = call_record;

        return call_record;
      }
    });
  }

  private _executeCrmApi(conn: any) {
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

  private inboundCallEnter(): any {
    let self = this;

    eslServerRes.on('connection::ready', function (conn) {
      console.log('CONNECTION SERVER READY');

      self._onListen(conn);

      let inboundConfig = null;

      if (callerId != null) {
        inboundConfig =
          self._inboundCallConfig.getInboundCallByPhoneNumber(callerId);
      }

      console.log('INBOUND CALL', inboundConfig);

      // conn.execute('set', `effective_caller_id_number=+17132633132`);

      // conn.execute('bridge', `sofia/gateway/fs-test1/1000`);

      // conn.on('esl::end', function (evt, body) {

      //   console.log('ESL END');
      //   console.log('CDR - END', CDR);

      //   http.get(WebhookIncomingStatusCallBack(CDR), function (res) {});
      // });

      if (inboundConfig != null){

        let value = JSON.parse(inboundConfig.Value);

        if (value != null){

          conn.execute('set', `effective_caller_id_number=+1${value.callerId}`);

          conn.execute('bridge', `sofia/gateway/sip_provider/+1${value.phoneNumberTo}`);
        }

        conn.on('esl::end', function(evt,body) {

          console.log('ESL END');
          console.log('CDR - END' ,CDR);

          http.get(WebhookIncomingStatusCallBack(CDR), function(res){
          })
        })

      }
    });
  }

  private incomingCallEnter(): any {
    // const self = this;
    let connData = null;
    eslServerRes.on('connection::ready', function (conn) {
      console.log('CONNECTION SERVER READY');
      connData = conn;

      // self._onListen(conn);

      // self._executeCrmApi(conn);

      conn.execute('set', 'effective_caller_id_number=+17132633133');

      conn.execute('bridge', 'sofia/gateway/fs-test3/1000');

      conn.on('esl::end', function (evt, body) {
        console.log('TRIGGER WEBHOOK');

        console.log('CDR - end', CDR);

        http.get(WebhookIncomingStatusCallBack(CDR), function (res) {
          // console.log('ENTERED GET ', res);
        });

        // call webhook here
      });
    });
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
