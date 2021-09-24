import { OutboundCallService } from 'src/modules/outbound-call/services/outbound-call.service';
import { CHANNEL_VARIABLE } from '../constants/channel-variables.constants';
import { ESL_SERVER, FS_ESL } from '../constants/fs-esl.constants';
import esl from 'modesl';
import { TimeProvider  } from 'src/utils/timeProvider.utils';
import axios from 'axios';
import { VoiceRequestParam } from './inbound-call/models/voiceRequestParam';
import { CallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.service';
import { ICallDetailRecordService } from 'src/modules/call-detail-record/services/call-detail-record.interface';
import { DialplanInstruction, TwiMLXMLParser } from '../parser/xmlParser';
import { CommandConstants } from '../constants/freeswitch-command.constants';
import { FreeswitchDpConstants } from '../constants/freeswitchdp.constants';
import { TimeConversion } from 'src/utils/timeConversion.utils';
import { PlayAndGetDigitsParam } from './inbound-call/models/plagdParam';
import { CustomAppLogger } from 'src/logger/customLogger';

export class ClickToCallServerHelper {
  
  private readonly _logger = new CustomAppLogger(ClickToCallServerHelper.name);

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

      let context = new ClickToCallContext();

      context.conn = conn;

      context.logger = this._logger;

      context.Log('Click To Call -- server ready');

      let legId = conn
        .getInfo()
        .getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

      let phoneNumberFrom = conn 
        .getInfo()
        .getHeader(CHANNEL_VARIABLE.CALLER_CALLE_ID_NUMBER);

      context.Log(`Leg-A : ${legId}`);

      conn.on('error', (err) => {
        context.Log(`Click To Call Error -> ${err}`, true);
      });
     
      context.outboundRequestParam.From = phoneNumberFrom;

      this._callDetailRecordService
      .getByCallUid(legId)
      .then((result) => {

          if (result === undefined){
            this.callRejectedHandler(context, () =>{
              context.Log('Call rejected', true);
              return;
            });
          }

          let PLAGD = this.setPlayAndGetDigits();

          conn.execute('play_and_get_digits',
            `${PLAGD.minValue} ${PLAGD.maxValue} ${PLAGD.tries} ${PLAGD.timeout} ${PLAGD.terminator} ${PLAGD.soundFile} ${PLAGD.invalidFile} ${PLAGD.var_name} ${PLAGD.regexValue}`, 
            (e) => {

            let inputtedDigit = e.getHeader(`variable_${PLAGD.var_name}`);

            if (inputtedDigit === PLAGD.regexValue){
              conn.execute('export', 
              'execute_on_answer=record_session $${recordings_dir}/${uuid}.mp3', () => {
                  
                  conn.execute('bridge', `sofia/gateway/fs-test3/${result.PhoneNumberTo}`, () => {
                  });
              });
            }
            else
            {
                this.callRejectedHandler(context, () => {
                    context.Log('Call rejected', true);
                    return;
                });
            }
        });

          // context.outboundRequestParam.NumberToCall = result.PhoneNumberTo;

          // this.getInstruction(context, () =>{

          //   if (context.legStop){
          //     console.log('Cannot continue to process further instruction');
          //     return;
          //   }

          //   this.setInstruction(context);

          //   if (context.legStop){
          //     console.log('Cannot continue to process further instruction');
          //     return;
          //   }

          //   this.executeInstruction(context, () => {
          //     //call webhook url
          //   });

          // });
      })
      .catch((err) => {
        console.log('ERROR ', err);
      });
    });
  }

  private setPlayAndGetDigits():PlayAndGetDigitsParam{

    let timeout = new TimeConversion().secondsToMS(10000);

    return {
        minValue: 1,
        maxValue: 11,
        tries : 2,
        timeout: timeout,
        terminator: '#',
        soundFile : 'ivr/ivr-enter_destination_telephone_number.wav',
        invalidFile: 'ivr/ivr-that_was_an_invalid_entry.wav',
        regexValue: '1',
        var_name : 'inboundCall_target_num'
    };
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
        context.Log('Playback executed');

        connection.execute('hangup', 'CALL_REJECTED', () => {
            context.Log('hnagup completed!');
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
  legId:string;
  logger:CustomAppLogger;
  Log(message:string, error:boolean=false){
    let lmsg = `CallUId: ${this.legId} => ${message}`;

    if (error) this.logger.error(lmsg, new Error(message));
    else this.logger.info(lmsg);
}
}

class OutboundRequestParam extends VoiceRequestParam{
  NumberToCall:string;
  DisplayCallerId:string;
}
