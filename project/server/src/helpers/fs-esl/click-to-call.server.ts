import { OutboundCallService } from 'src/modules/outbound-call/services/outbound-call.service';
import { CHANNEL_VARIABLE } from '../constants/channel-variables.constants';
import { ESL_SERVER, FS_ESL } from '../constants/fs-esl.constants';
import esl from 'modesl';
import { TimeProvider  } from 'src/utils/timeProvider.utils';
import axios from 'axios';
import { VoiceRequestParam } from './models/voiceRequestParam';
import { CallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.service';
import { ICallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.interface';
import { DialplanInstruction, TwiMLXMLParser } from '../parser/xmlParser';
import { CommandConstants } from '../constants/freeswitch-command.constants';
import { FreeswitchDpConstants } from '../constants/freeswitchdp.constants';

export class ClickToCallServerHelper {
  
  constructor(
    private readonly _outboundCallService: OutboundCallService,
    private readonly _callDetailRecordService: ICallDetailRecordService
  ) {}

  startClickToCallServer() {

    let server = new esl.Server(
      {
        port: 8000,
        host: '0.0.0.0',
        myevents: true,
      });

    server.on(ESL_SERVER.CONNECTION.READY, (conn) => {
      
      console.log('Click To Call - server ready');

      let context = new ClickToCallContext();

      context.conn = conn;

      let legId = conn
        .getInfo()
        .getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

      let phoneNumberFrom = conn 
        .getInfo()
        .getHeader(CHANNEL_VARIABLE.CALLER_CALLE_ID_NUMBER);

      console.log('LEG-A', legId);

      conn.on('error', (err) => {
        console.log('Click To Call Error -> ', err);
      });
     
      context.outboundRequestParam.From = phoneNumberFrom;

      this._callDetailRecordService
      .getByCallUid(legId)
      .then((result) => {

          if (result === undefined){
            this.callRejectedHandler(context, () =>{
              console.log('Call rejected');
              return;
            });
          }

          context.outboundRequestParam.NumberToCall = result.PhoneNumberTo;

          this.getInstruction(context, () =>{

            if (context.legStop){
              console.log('Cannot continue to process further instruction');
              return;
            }

            this.setInstruction(context);

            if (context.legStop){
              console.log('Cannot continue to process further instruction');
              return;
            }

            this.executeInstruction(context, () => {

            });

          });
      })
      .catch((err) => {
        console.log('ERROR ', err);
      });
    });
  }

  private getInstruction(context:ClickToCallContext,callback){
    let dialNumber = 'http://localhost:8080/TwilioCallApi/DialNumber';

    this.triggerWebhookUrl(dialNumber, 'POST', context.outboundRequestParam, (twiMLResponse) => {
      console.log('TwiML Response ', twiMLResponse);

      context.twiMLResponse = twiMLResponse;

      callback(context);
    })
    .catch((err) => {
      let errMessage = 'Error in requesting webhook url -> ' + err;

      console.log(errMessage);

      this.callRejectedHandler(context, () => {
        console.log('Error handled!');
        context.legStop = true;
        callback(context);
      });
    });
  }

  private setInstruction(context:ClickToCallContext){
    let parseResult = new TwiMLXMLParser().tryParse(context.twiMLResponse);

    if (parseResult.length <= 0){
      context.legStop = true;
      return;
    }

    for (let i = 0; i < parseResult.length; i++){

      let instruction = parseResult[i];

      if (instruction.command === CommandConstants.exec){
        if (instruction.name === FreeswitchDpConstants.bridge){
          context.dialplanInstructions.push(instruction);
        }
      }
    }

    context.instructionValidated = true;
  }

  private executeInstruction(context:ClickToCallContext, callback){
    let connection = context.conn;

    let size = context.dialplanInstructions.length;

    if (size === 1){
      let instruction = context.dialplanInstructions[0];

      if (instruction.name === FreeswitchDpConstants.bridge){
        connection.execute('export',
        'execute_on_answer=record_session $${recordings_dir}/${uuid}.wav', () =>{

          if (instruction.children != undefined &&
            instruction.children.name === 'Number'){
              let numberToCall = instruction.value;

              console.log('NumberToCall -> ' , context.outboundRequestParam.NumberToCall);

              connection.execute('bridge', `sofia/gateway/fs-test3/1000`, (cb) => {
                console.log('bridge completed');
                console.log('B-Leg', cb.getHeader(CHANNEL_VARIABLE.UNIQUE_ID));
                context.legStop = true;
                context.dialplanInstruction= instruction;
                callback(context);
                return;
              });
            }
        });
      }
    }
  }

  private async triggerWebhookUrl(
    webhookUrl:string,
    httpMethod:string,
    params: VoiceRequestParam,
    callback){

    let record = null;

    if (httpMethod === "POST"){
      record = await axios.post(webhookUrl, params);
    }
    else
    {
      record = await axios.get(webhookUrl, { params : params });
    }

    callback(record.data)
  }

  private callRejectedHandler(context:ClickToCallContext, callback){
    let connection = context.conn;

    connection.execute('playback', 'ivr/ivr-call_cannot_be_completed_as_dialed.wav', () => {
        console.log('Playback executed!');

        connection.execute('hangup', 'CALL_REJECTED', () => {
            console.log('hangup complete!');
            context.legStop = true;
            callback();
        });
    });
  }
}

class ClickToCallContext{
  conn:any;
  outboundRequestParam: OutboundRequestParam = new OutboundRequestParam();
  legStop:boolean=false;
  twiMLResponse:string;
  dialplanInstructions: DialplanInstruction[] = [];
  instructionValidated:boolean=false;
  dialplanInstruction:DialplanInstruction;
}

class OutboundRequestParam extends VoiceRequestParam{
  NumberToCall:string;
  DisplayCallerId:string;
}
