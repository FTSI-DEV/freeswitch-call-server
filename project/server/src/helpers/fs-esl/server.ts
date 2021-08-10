import apiClient from 'src/utils/apiClient';
import { FS_DIALPLAN } from '../constants/freeswitch.constants';
import { TwiMLContants } from '../constants/twiml.constants';
import { KeyValues, XMLParser } from '../parser/twimlXML.parser';
import { StartFreeswitchApplication } from './event-socket-monitor';

export class EslServerHelper {

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

      //return this a promise
      apiClient
        .getIncomingCallVerify({
          StoreId: 60,
          SystemId: 1,
        })
        .then((res) => {
          // //semantic-processor
          let xmlParserResult = new XMLParser().tryParseXMLBody(res.data);

          let dialplan_taskList = self.XmlConversionTaskValues(xmlParserResult);

          dialplan_taskList.forEach(element => {
            conn.execute(element.key, element.value);
          });
        })
        .catch((err) => console.log(err));

      conn.execute('bridge', 'sofia/gateway/fs-test3/1000');

      conn.on('esl::end', function (evt, body) {
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
