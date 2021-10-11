import { DialplanInstruction, TwiMLXMLParser } from "src/helpers/parser/xmlParser";
import { CommandConstants } from "src/helpers/constants/freeswitch-command.constants";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { PlayAndGetDigitsParam } from "../../inbound-call/models/plagdParam";
import { DialConfirm } from "./dialConfirm";
import { DialInputFailed } from "./dialInputFailed";
import { CallRejectedHandler } from "./callRejectedHandler";
import { WebhookUrlHelper } from "../../webhookUrl.helper";
import { OutboundCallContext } from "../models/outboundCallContext";
import { FreeswitchDpConstants } from "src/helpers/constants/freeswitchdp.constants";

export class DialVerify{

    private outboundDialVerifyUrl = 'http://localhost:8080/TwilioCallApi/DialVerify';

    constructor(
        private readonly _context: OutboundCallContext,
        private readonly twiMLParser = new TwiMLXMLParser(_context.redisServer),
        private readonly timeConversion = new TimeConversion(),
        private readonly _callRejectedHandler = new CallRejectedHandler(_context),
        private readonly _webhookHelper = new WebhookUrlHelper()
    ){ }

    dialVerify(){

       this.getInstruction(this._context, (response) => {

            if (this._context.callRejected){
                this._callRejectedHandler.reject(this._context, () => {
                    console.log('Call has been rejected');
                });
                return;
            }

          console.log('instructions ->' , response);

           this.parseInstruction(response);

           this.executeInstruction(() => {

                console.log('Finished processing instruction ');

                if (this._context.callRejected){
                    console.log('call rejected ', this._context.callRejected);
                }

                if (this._context.plagdStop){

                    console.log('Next instruction');
                    
                    new DialConfirm(
                        this._context,
                        this.twiMLParser,
                        this._callRejectedHandler,
                        this._webhookHelper
                    ).dialConfirm();

                }

                if (this._context.redirect){

                    this._context.requestParam.ActionId = 10;

                    new DialInputFailed(
                        this._context,
                        this.twiMLParser, 
                        this.timeConversion)
                    .userDialInputFailed();
                }
           });
       });
    }

    private executeInstruction(callback:any){
        
        let dialplanInstructionList = this._context.dpInstructions;

        if (dialplanInstructionList.length === 0){

            console.log('total -> ', dialplanInstructionList.length);

            console.log('Call must be rejected');

            this._context.callRejected = true;

            this._callRejectedHandler.reject(this._context, () => {
                callback();
            });

            return;
        }

        let totalCount = dialplanInstructionList.length;

        console.log('Total instructions to be executed ', totalCount);

        let connection = this._context.connection;

        let instruction = dialplanInstructionList.shift();

        if (totalCount > 0){

            if (instruction.command === CommandConstants.exec){

                if (instruction.name === FreeswitchDpConstants.sleep){

                    connection.execute(instruction.name,
                        this.timeConversion.secondsToMS(Number(instruction.pauseAttribute.length)) , () => {

                        console.log('Sleep executed');
                        totalCount--;

                        this.executeInstruction(() => {
                            callback();
                        })
                    });
                }
                else if (instruction.name === FreeswitchDpConstants.speak){

                    connection.execute(instruction.name,
                        `flite|kal|${instruction.value}`, () => {

                        console.log('Speak executed');
                        totalCount--;
                        this.executeInstruction(() => {
                            callback();
                        })
                    });
                }
                else if (instruction.name === FreeswitchDpConstants.play_and_get_digits){

                    this.executePLAGD(instruction, () => {

                        totalCount--;

                        if (this._context.plagdStop){
                            //call uri
                            console.log('Execute webhook Here');

                            callback(this._context);
                            return;
                        }
                        else
                        {
                            this.executeInstruction(() => {
                                callback();
                            })
                        }
                    });
                }
            }
            else if (instruction.command === CommandConstants.axios){

                console.log('Axios ', totalCount);
                totalCount--;

                this._context.webhookParam = {
                    actionUrl: instruction.value,
                    httpMethod: null
                };

                this._context.redirect = true;

                console.log('Redirected -> ', this._context.redirect);

                callback(this._context);
            }          
        }
        else
        {
            callback(this._context);
        }
    }

    private parseInstruction(response:string){
        let parseInstruction = this.twiMLParser.tryParse(response);

        this._context.dpInstructions = parseInstruction;
    }

    private getInstruction(context:OutboundCallContext, callback){

        this._webhookHelper
        .triggerWebhook(this.outboundDialVerifyUrl, 'POST', context.requestParam, (response) => {
            
            if (response.Error){

                context.legStop = true;
                
                context.callRejected = true;
                
                console.log('Error: -> ', response.ErrorMessage);

                callback();
            }
            else{
                callback(response.Data);
            }
        });
    }

    private executePLAGD(instruction:DialplanInstruction,callback){

        let PLAGD = this.setPlayAndGetDigits(instruction);

        this._context.connection.execute(instruction.name,
            `${PLAGD.minValue} ${PLAGD.maxValue} ${PLAGD.tries} ${PLAGD.timeout} ${PLAGD.terminator} ${PLAGD.soundFile} ${PLAGD.invalidFile} ${PLAGD.var_name} ${PLAGD.regexValue}`,
            (cb) => {

            console.log('PLAG JSON ', JSON.stringify(cb));

            console.log('PLAGD executed ' + new Date());

            this._context.channelState = {
                legId: this._context.legId,
                channelState : cb.getHeader('Channel-State'),
                answerState: cb.getHeader('Answer-State')
            }

            this._context.redisServer.set(this._context.redisServerName, 
                JSON.stringify(this._context.channelState), (err,reply) => {
                console.log('Redis State Saved! -> ');
            });

            let inputtedDigit = cb.getHeader(`variable_${PLAGD.var_name}`);

            let hasInputtedDigit = cb.getHeader(`variable_read_result`);

            if (hasInputtedDigit === 'failure'){
                this._context.plagdNext = true;
                callback(this._context);
            }
            else
            {
                this._context.requestParam.Digits = inputtedDigit;

                console.log('Inputted digit ', inputtedDigit);

                this._context.webhookParam = {
                    actionUrl : instruction.gatherAttribute.action,
                    httpMethod: instruction.gatherAttribute.method
                };
                
                this._context.plagdStop = true;

                callback(this._context);
            }
        });
    }

    private setPlayAndGetDigits(nextInstruction:DialplanInstruction):PlayAndGetDigitsParam{

        let timeout = this.timeConversion.secondsToMS(Number(nextInstruction.gatherAttribute.timeout));

        return {
            minValue: 1,
            maxValue: 11,
            tries : 1,
            timeout: timeout,
            terminator: '#',
            regexValue: nextInstruction.gatherAttribute.numDigits,
            var_name : 'outboundCall_target_num',
            soundFile : 'ivr/ivr-enter_destination_telephone_number.wav',
            invalidFile: null
        };
    }
}