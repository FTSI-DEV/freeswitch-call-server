import axios from "axios";
import { CDRModels } from "src/models/cdr.models";
import { InboundCallConfigService } from "src/modules/config/inbound-call-config/services/inbound-call-config.service";
import { WebhookInboundCallStatusCallBack } from "src/utils/webhooks";
import { CHANNEL_VARIABLE } from "../constants/channel-variables.constants";
import { ESL_SERVER, FS_DIALPLAN } from "../constants/fs-esl.constants";
import { TwiMLContants } from "../constants/twiml.constants";
import { KeyValues, XMLParser, XMLParserHelper } from "../parser/twimlXML.parser";
import { http } from "../libs/http";
import { eslServerRes } from "./inboundCall.server";
import { Instructions } from '../../helpers/parser/xmlCommandObject';

export class InboundCallHelper{

    constructor(
        private readonly _inboundCallConfig: InboundCallConfigService
    ){}

    inboundCallEnter(){

        let self = this;

        eslServerRes.on(ESL_SERVER.CONNECTION.READY, function(conn){

            console.log('bridge executed');
            
            // conn.execute('playback', 'https://crm.dealerownedsoftware.com/hosted-files/ivr-rec-2/WelcomeMessage.mp3');

            conn.execute('sleep', '5000');

            conn.execute('set', 'hangup_after_bridge=true');

            // conn.execute('export', 'execute_on_answer=record_session $${recordings_dir}/${strftime(%Y-%m-%d-%H-%M-%S)}_${uuid}_${caller_id_number}.wav');

            conn.execute('bridge', 'sofia/gateway/fs-test1/1000');

            conn.execute('playback', 'https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav');
            
            let eslInfo = conn.getInfo();

            let destinationNumber = eslInfo.getHeader(CHANNEL_VARIABLE.CALLER_DESTINATION_NUMBER);

            console.log('DESTINATION NUMBER -> ', destinationNumber);

            // 

            // 

            // console.log('GetINFO -> ', conn.getInfo());


            // conn.execute('bridge', 'sofia/gateway/fs-test3/1000');
      
          
           
            // self.inboundCallExecute(conn, destinationNumber);
        });
    }

    private inboundCallExecute(conn, callerId:string){

        this._inboundCallConfig.getInboundConfigCallerId(callerId)
            .then( async (result) => {
                
                if (!result)  conn.execute('playback', 'https://crm.dealerownedsoftware.com/hosted-files/audio/ConvertedSalesService.wav');
    
                let apiRetVal = await this.triggerWebhookURL(result);

                if (apiRetVal)
                {
                    //Parse xml to json
                    let xmlParserResult = new XMLParser().tryParseXMLBody(apiRetVal);

                    // Converted xml
                    let dialplan_taskList = this.XmlConversionTaskValues(xmlParserResult);

                    console.log('dialplan_tasklist: ', dialplan_taskList);

                    await this.executeTask(dialplan_taskList,conn);
                }

            }).catch((err) => {
                console.log('UNEXPECTED ERROR -> ', err);
            }); 
    }

    private async triggerWebhookURL(result) {
        const { webhookUrl, httpMethod } = result;
        let record = null;
        if ( httpMethod == "POST" ) {
          record = await axios.post(webhookUrl);
        } else {
          record = await axios.get(webhookUrl, { params: { StoreId: 60, SystemId: 1355983 } });
        }
        return record.data;
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

    private async executeTask(convertedTaskList: KeyValues[], conn){

        convertedTaskList.forEach((item) => {
            conn.execute('bridge', 'sofia/gateway/fs-test3/1005');
        });
    }

    //callwebhook when call ends
    private triggerIncomingStatusCallBack(cdrModel: CDRModels){
        http.get(WebhookInboundCallStatusCallBack(cdrModel));
    }

    private executeTaskList(instructionsList: Instructions[], conn) {
       if (instructionsList.length) {
            for (let i = 0; i < instructionsList.length; i++) {
                const element = instructionsList[i];
                if (element.command === 'Say') {
                    conn.execute('say', 'en name_spelled pronounced john');
                    //conn.execute('say', 'en messaged pronounced john');
                  } else if (element.command === 'Reject') {
                    conn.execute('hangup');
                  }
            }
       } else {
        conn.execute('hangup');
       }
    }
}