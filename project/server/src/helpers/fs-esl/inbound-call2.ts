import axios from 'axios';
import { InboundCallConfigService } from 'src/modules/config/inbound-call-config/services/inbound-call-config.service';
import { CHANNEL_VARIABLE } from '../constants/channel-variables.constants';
import { EVENT_LIST } from '../constants/event-list.constants';
import { CommandConstants } from '../constants/freeswitch-command.constants';
import { FreeswitchDpConstants } from '../constants/freeswitchdp.constants';
import { DialplanInstruction, TwiMLXMLParser } from '../parser/xmlParser';
import { inboundCallServer } from './inboundCall.server';

export class InboundCallHelper2 {
  constructor(private readonly _inboundCallConfig: InboundCallConfigService) {}

  inboundCallEnter() {
    inboundCallServer.on('connection::ready', (conn) => {
      console.log('Inbound Call - server ready!');

      let context = new InboundCallContext();

      let phoneNumberFrom = conn
        .getInfo()
        .getHeader(CHANNEL_VARIABLE.CALLER_CALLER_ID_NUMBER);

      let legId = conn.getInfo().getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

      let hangupCompleteEvent = 'esl::event::CHANNEL_HANGUP_COMPLETE::' + legId;

      conn.subscribe(EVENT_LIST.CHANNEL_HANGUP_COMPLETE);

      let hangupCompleteWrapper = (esl) => {
        context.legStop = true;
        console.log('Leg-A hangup');
        conn.removeListener(hangupCompleteEvent, hangupCompleteWrapper);
      };

      conn.on('error', (err) => {
        console.log('ERROR -> ', err);
      });

      conn.on(hangupCompleteEvent, hangupCompleteWrapper);

      if (!context.legStop) {
        // PLAY WELCOME MESSAGE
        conn.execute(
          'playback',
          'https://crm.dealerownedsoftware.com/hosted-files/ivr-rec-2/WelcomeMessage.mp3',
          () => {
            console.log('playback executed ');

            this._inboundCallConfig
              .getInboundConfigCallerId('8667468950')
              .then((config) => {

                let voiceRequestParam = new VoiceRequestParam();

                voiceRequestParam.From = phoneNumberFrom;
                voiceRequestParam.To = config.callerId;
                voiceRequestParam.StoreId = 60;
                voiceRequestParam.SystemId = 0;

                this.triggerWebhookUrl(config.webhookUrl,config.httpMethod,voiceRequestParam,
                  (twiMLResponse) => {
                    //start for the first instruction to be executed.
                    console.log('RESULT CONFIG -> ', twiMLResponse);

                    let parseResult = new TwiMLXMLParser().tryParse(twiMLResponse);

                    this.dpInstruction(parseResult, context);

                    console.log('context', context);

                    if (context.isValidated) {
                      let minValue = '1'; // minimum number of digits to collect;
                      let maxValue = '11'; // maximum number of digits to collecct;
                      let tries = '2'; // number of attempts to play the file and collect digits
                      let timeout = '10000'; // number of milliseconds to wait before assuming the caller is done entering digits
                      let terminator = '#'; // digits used to end input
                      let soundFile =
                        'ivr/ivr-enter_destination_telephone_number.wav'; // sound file to play while digits are fetched.
                      let invalidFile = 'ivr/ivr-that_was_an_invalid_entry.wav'; // sound file to play when digits don't match the regex
                      let regexValue =
                        context.dialplanInstruction.gatherAttribute.numDigits; // regular expression to match digits
                      let digit_timeout = '3000'; // (optional) number of milliseconds to wait between digits
                      let var_name = 'target_num'; // channel variable that digits should be placed in

                      console.log('digits -> ', regexValue);

                      console.log('command -> ',context.dialplanInstruction.command);

                      if (context.dialplanInstruction.command === 'exec') {

                        conn.execute(
                          context.dialplanInstruction.name,
                          `${minValue} ${maxValue} ${tries} ${context.dialplanInstruction.gatherAttribute.timeout}000 ${terminator} ${soundFile} ${invalidFile} ${var_name} ${regexValue}`,
                          (e) => {

                            let inputtedDigit = e.getHeader(`variable_${var_name}`);

                            console.log('Digit entered -> ', inputtedDigit);

                            if (context.legStop) {
                              console.log('Leg has stop');
                              return;
                            }

                            if (inputtedDigit === regexValue) {

                              console.log('VALID INPUT -> ', inputtedDigit);

                              voiceRequestParam.Digits = inputtedDigit;

                              //2nd instruction to be executed
                              this.secondInstruction(context,voiceRequestParam, conn, () => {
                                console.log('SECOND INSTRUCTION EXECUTED');
                              });

                            } else {
                              console.log('INVALID INPUT -> ', inputtedDigit);

                              conn.execute('hangup', 'CALL_REJECTED', (cb) => {
                                console.log('CALL REJECTED EXECUTED!');
                                context.legStop = true;
                                return;
                              });
                            }
                          });
                      }
                    }
                    else{
                      conn.execute(context.dialplanInstruction.name, 'NORMAL_CLEARING', () => {
                        console.log('HANGUP COMPLETE');
                      });
                    }
                  },
                );
              })
              .catch((err) => {
                console.log('ERROR -> ' ,err);
              });
          },
        );
      }
    });
  }

  private dpInstruction(
    parseResult: DialplanInstruction[],
    context: InboundCallContext) {

    for (let i = 0; i < parseResult.length; i++) {

      let instruction = parseResult[i];

      if (instruction.command === CommandConstants.exec) {

        let hasGatherInstruction = parseResult.find((i) => i.name === FreeswitchDpConstants.play_and_get_digits);

        if (hasGatherInstruction) {
          context.isValidated = true;
        }

        if (context.isValidated){

          if (instruction.name === FreeswitchDpConstants.play_and_get_digits){
            context.dialplanInstruction = instruction;
            return;
          }
        }
        else
        {
          context.dialplanInstruction = instruction;
        }
      }
    }
  }

  private dpInstruction2(parseResult: DialplanInstruction[], context: InboundCallContext) {

    for (let i = 0; i < parseResult.length; i++) {

      let nextInstruction = parseResult[i];

      if (nextInstruction.command === CommandConstants.axios) 
      {

        nextInstruction.order = 2;

        context.dialplanInstructions.push(nextInstruction);
      } 
      else if (nextInstruction.command === CommandConstants.exec) 
      {
        if (nextInstruction.name === FreeswitchDpConstants.speak) 
        {
          context.speakExecuted = true;

          nextInstruction.order = 1;

          context.dialplanInstructions.push(nextInstruction);
        }
      }
    }
  }

  private dpInstruction3(parseResult: DialplanInstruction[], context: InboundCallContext) {

    for (let i = 0; i < parseResult.length; i++) {

      let nextInstruction = parseResult[i];

      if (nextInstruction.command === CommandConstants.exec) {

        context.isValidated = true;

        if (nextInstruction.name === FreeswitchDpConstants.playback) {

          nextInstruction.order = 1;

          context.dialplanInstructions.push(nextInstruction);

        } 
        else if (nextInstruction.name === FreeswitchDpConstants.bridge) {

          nextInstruction.order = 2;

          context.dialplanInstructions.push(nextInstruction);
        } 
        else if (nextInstruction.name === FreeswitchDpConstants.speak) {

          context.dialplanInstruction = nextInstruction;
        }
      }
    }
  }

  private thirdInstruction(nextInstruction:DialplanInstruction, 
    context:InboundCallContext, 
    voiceRequestParam:VoiceRequestParam,
    conn, callback){

        //3rd instruction to be executed
        this.triggerWebhookUrl(nextInstruction.value,null,voiceRequestParam, (twiMLResponse) => {

            console.log('TwiML Response -> ',twiMLResponse);

            context.dialplanInstructions = [];

            let twiMLNextParseResult = new TwiMLXMLParser().tryParse(twiMLResponse);

            this.dpInstruction3(twiMLNextParseResult,context);

            if (context.isValidated) {

              let instructionSize = context.dialplanInstructions.length;

              console.log('size ',instructionSize);

              console.log('INSTRUCTIONS', JSON.stringify(context.dialplanInstructions));

              if (instructionSize === 2) {

                let nextInstruction = context.dialplanInstructions[0];

                if (nextInstruction.name === FreeswitchDpConstants.playback) {

                  conn.execute(`${nextInstruction.name}`,`${nextInstruction.value}`,() => {

                      console.log('playback executed ');
                      nextInstruction = context.dialplanInstructions[1];
                      console.log( 'next -> ', JSON.stringify(nextInstruction));

                      if (nextInstruction.name === FreeswitchDpConstants.bridge) {
                        console.log('bridge validated!');
                        if (nextInstruction.dialAttribute.recordCondition === RecordEnum.RecordFromAnswer) {

                          conn.execute(
                            'export',
                            'execute_on_answer=record_session $${recordings_dir}/${strftime(%Y-%m-%d-%H-%M-%S)}_${uuid}_${caller_id_number}.wav',
                            () => {

                              console.log('Number -> ', nextInstruction.children.value);
                              conn.execute(nextInstruction.name, `sofia/gateway/fs-test3/1000`,(cb) => {

                                  console.log('bridge completed');
                                  console.log('B-Leg', cb.getHeader(CHANNEL_VARIABLE.UNIQUE_ID));
                                  context.bridgeCompleted = true;

                                  //insert handler for inboundStatusCallback
                                  callback();
                              });
                          });
                        }
                      }
                  });
                }
              } else {
                console.log('HANGUP HERE');
                console.log('HANGUP -> ',JSON.stringify(context.dialplanInstruction));

                if (context.dialplanInstruction.name === FreeswitchDpConstants.speak) {
                 
                  conn.execute(context.dialplanInstruction.name,
                    `flite|kal|${context.dialplanInstruction.value}`,
                    () => {

                      console.log('speak executed -> ');

                      conn.execute('hangup','NORMAL_CLEARING', () => {
                          console.log('HANGUP -> ');

                          context.legStop = true;
                          callback();
                          return;
                      });
                  });
                }
              }
            }
          },
        ).catch((err) => {
          console.log('ERRO -> ', err);
        });
  }

  private secondInstruction(context:InboundCallContext, 
    voiceRequestParam:VoiceRequestParam,
    conn,
    callback){
    this.triggerWebhookUrl(context.dialplanInstruction.gatherAttribute.action,
      context.dialplanInstruction.gatherAttribute.method,
      voiceRequestParam,
      (twiMLResponse) => {

        console.log('TwiML Response -> ',twiMLResponse);

        let twiMLNextParseResult = new TwiMLXMLParser().tryParse(twiMLResponse);

        this.dpInstruction2(twiMLNextParseResult,context);

        let nextInstructionSize = context.dialplanInstructions.length;

        if (nextInstructionSize >= 1) {

          let nextInstruction = context.dialplanInstructions[0];

          conn.execute(
            `speak`,
            `flite|kal|${nextInstruction.value}`,
            () => {
              console.log('speak executed');

              nextInstruction = context.dialplanInstructions[1];

              if (nextInstruction.command === CommandConstants.axios) {

                // voiceRequestParam.To = '10000';

                //third instruction here
                this.thirdInstruction(nextInstruction, context,voiceRequestParam,conn,()=>{
                  console.log('Third instruction executed');
                });
              }

              callback();
            });
        }
      })
      .catch(err => {
        console.log('ERROR -> ', err);
        callback();
      });
  }

  private async triggerWebhookUrl(
    webhookUrl: string,
    httpMethod: string,
    params: VoiceRequestParam,
    callback,
  ) {
    let record = null;

    console.log(
      `METHOD -> ${httpMethod} , WEBHOOK -> ${webhookUrl} , Params -> ${JSON.stringify(
        params,
      )}`,
    );

    if (httpMethod === 'POST') {
      record = await axios.post(webhookUrl, params);
    } else {
      record = await axios.get(webhookUrl, { params: params });
    }

    callback(record.data);
  }
}

class InboundCallContext {
  isValidated: boolean = false;
  dialplanInstruction: DialplanInstruction;
  dialplanInstructions: DialplanInstruction[] = [];
  dialplanInstruction1: DialplanInstruction;
  bridgeCompleted: boolean = false;
  legStop: boolean = false;
  speakExecuted: boolean = false;
}

class VoiceRequestParam {
  Digits: string;
  To: string;
  From: string;
  RecordingUrl: string;
  CallSid: string;
  DialCallStatus: string;
  DialCallDuration: string;
  CallDirection: string;
  StoreId: number;
  SystemId: number;
}

const RecordEnum = {
  DoNotRecord: 'do-not-record',
  RecordFromAnswer: 'record-from-answer',
  RecordFromRinging: 'record-from-ringing',
  RecordFromAnswerDual: 'record-from-answer-dual',
  RecordFromRingingDual: 'record-from-ringing-dual',
};
