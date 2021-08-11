import { log } from 'console';
import e from 'express';
import apiClient from 'src/utils/apiClient';
import { FS_DIALPLAN, FS_ESL } from '../constants/freeswitch.constants';
import { TwiMLContants } from '../constants/twiml.constants';
import { KeyValues, XMLParser } from '../parser/twimlXML.parser';
import { CDRHelper } from './cdr.helper';
import { StartFreeswitchApplication } from './event-socket-monitor';

export class EslServerHelper {

  private readonly _callRecords = new CDRHelper();

  private _onListen(conn:any):any{
    conn.on(FS_ESL.RECEIVED, fsEvent => {
      const eventName = fsEvent.getHeader('Event-Name');
      console.log('LISTENING TO AN EVENT ->' ,eventName);
      let call_record = this._callRecords.getCallRecords(fsEvent);

      if (call_record != undefined){
        return call_record;
      }
    });
  }

  private _executeCrmApi(conn:any){
    console.log('EXECUTING CRM API -> ');
    apiClient.getIncomingCallEnter({
      StoreId: 60,
      SystemId: 1
    })
    .then((res) => {
      let xmlParserResult = new XMLParser().tryParseXMLBody(res.data);

      let dialplan_taskList = this.XmlConversionTaskValues(xmlParserResult);

      dialplan_taskList.forEach(element => {
          console.log(`Key: ${element.key} , Value: ${element.value}`);

          if (element.key === FS_DIALPLAN.Say){
            element.value = 'ivr/ivr-welcome_to_freeswitch.wav';
            element.key = 'playback';
          }

          conn.execute(element.key, element.value);

      });
    }).catch((err) => console.log('UNEXPECTED ERROR -> ', err));

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

   const self = this;

    esl_server.on('connection::ready', function (conn) {
      console.log('CONNECTION SERVER READY');

      let call_record = self._onListen(conn);

      console.log('CDR2 -> ', call_record);

      self._executeCrmApi(conn);

      conn.execute('bridge', 'sofia/gateway/fs-test3/1000');
      
      conn.on('esl::end', function (evt, body) {

        if (call_record != undefined){
          console.log('CDR -> ', call_record);
        }

        console.log('END CALL -> ', evt);

        console.log('END CALL BODY -> ', body);
        //save the record..
        //CDR..
        //insert code here how to handle a call when its end...
      });
    });
  }

  private XmlConversionTaskValues(xmlParserResult: KeyValues[]):KeyValues[]{

      let freeswitchTaskListKeyValues: KeyValues[] = [];

      xmlParserResult.forEach(element => {
              
        let newKeyValue = <KeyValues>{};

        newKeyValue.value = element.value;

        if (element.key === TwiMLContants.Say){
            newKeyValue.key = FS_DIALPLAN.Say;

            freeswitchTaskListKeyValues.push(newKeyValue);
        }
        else if (element.key === TwiMLContants.Dial){
          newKeyValue.key = FS_DIALPLAN.Dial;

          freeswitchTaskListKeyValues.push(newKeyValue);
        }
      });

      return freeswitchTaskListKeyValues;
  }
}
