import axios from "axios";
import { time } from "console";
import { CallTypes } from "src/helpers/constants/call-type";
import { CommandConstants } from "src/helpers/constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "src/helpers/constants/freeswitchdp.constants";
import { DialplanInstruction, TwiMLXMLParser } from "src/helpers/parser/xmlParser";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { VoiceRequestParam } from "../../models/voiceRequestParam";
import { WebhookUrlHelper } from "../../webhookUrl.helper";
import { InboundCallHelper2 } from "../inboundCall2";
import { InboundCallContext } from "../models/inboundCallContext";
import { PlayAndGetDigitsParam } from "../models/plagdParam";
import { CallRejectedHandler } from "./callRejectedHandler";

export class InboundCallDialplan {

    /**
     *
     */
    constructor(
        private  _context: InboundCallContext,
        private readonly _webhookHelper = new WebhookUrlHelper(),
        private readonly twiMLParser = new TwiMLXMLParser(_context.redisServer),
    ) {
    }


    processedInstruction(callback){

        let context = this._context;

        this.getInstruction(context, (response) => {

            if (context.callRejected){
                context.serviceModel.callRejectedHandler.reject(context, () => {});
                return;
            }

            this.parseInstruction(response);

            this.executeInstruction(() => {

                console.log('Finished executeInstruction ');

                if (this._context.callRejected){
                    this._context.serviceModel.callRejectedHandler.reject(context, () => {});
                    return;
                }

                if (this._context.bridgeExecuted){

                    context.inboundESLConnResult = {
                        callModel : {
                            webhookParam: context.webhookParam,
                            callDirection: CallTypes.Inbound,
                            requestParam: context.requestParam,
                            callRejected:false,
                            legId:context.legId
                        }
                    }
                }

                callback(this._context);
            });

        });
    }

    getInstruction(context:InboundCallContext, callback){

        this._webhookHelper
            .triggerWebhook(
                context.webhookParam.actionUrl,
                context.webhookParam.httpMethod,
                context.requestParam,
                (response) => {

                if (response.Error){

                    context.legStop = true;

                    context.callRejected = true;

                    context.errorMessage.push(response.ErrorMessage);

                    callback();
                }
                else{
                    callback(response.Data);
                }
            })

    }

    parseInstruction(response:string){

        let parseInstruction = this.twiMLParser.tryParse(response);

        this._context.dialplanInstructions = parseInstruction;

        console.log('Instruction Parsed! -> ', parseInstruction);
    }

    private executePLAGD(instruction:DialplanInstruction, callback){

        let PLAGD = this.setPLAGD(instruction);

        this._context.connection.execute(instruction.name,
            `${PLAGD.minValue} ${PLAGD.maxValue} ${PLAGD.tries} ${PLAGD.timeout} ${PLAGD.terminator} ${PLAGD.soundFile} ${PLAGD.invalidFile} ${PLAGD.var_name} ${PLAGD.regexValue}` ,
            (cb) => {

                this._context.channelState = {
                    legId: this._context.legId,
                    channelState : cb.getHeader('Channel-State'),
                    answerState: cb.getHeader('Answer-State')
                }

                this._context.redisServer.set(this._context.inboundChannelStateKey,
                    JSON.stringify(this._context.channelState), (err,reply) => {

                    if (err){
                        this._context.Log('Error while setting redis state', true);
                    }
                    else{
                        this._context.Log('Redis state saved');
                    }
                });

                let inputtedDigit = cb.getHeader(`variable_${PLAGD.var_name}`);

                let hasInputtedDigit = cb.getHeader(`variable_read_result`); 

                if (hasInputtedDigit === 'failure'){

                    this._context.plagdResult.plagdNext = true;
    
                    callback(this._context);
                }
                else
                {
                    this._context.requestParam.Digits = inputtedDigit;
                    
                    this._context.plagdResult.plagdStop = true;

                    this._context.webhookParam = {
                        actionUrl: instruction.gatherAttribute.action,
                        httpMethod:instruction.gatherAttribute.method
                    };
    
                    callback(this._context);
                }

        });
    }

    private setPLAGD(instruction:DialplanInstruction):PlayAndGetDigitsParam{

        let timeout = this._context.serviceModel.timeConversion.secondsToMS(Number(instruction.gatherAttribute.timeout));

        return {
            minValue: 1,
            maxValue: 11,
            tries : 1,
            timeout: timeout,
            terminator: '#',
            regexValue: instruction.gatherAttribute.numDigits,
            var_name : 'outboundCall_target_num',
            soundFile : 'ivr/ivr-enter_destination_telephone_number.wav',
            invalidFile: null
        };

    }

    executeInstruction(callback){

        let dialplanInstructionList = this._context.dialplanInstructions;

        if (dialplanInstructionList.length === 0){

            this._context.callRejected = true;

            this._context.errorMessage.push("No instructions found");

            this._context.serviceModel.callRejectedHandler.reject(this._context, () => {
                callback();
            });

            return;
        }

        let totalCount = dialplanInstructionList.length;

        console.log('Total Count -> ', totalCount);

        let connection = this._context.connection;

        let instruction = dialplanInstructionList.shift();

        if (totalCount > 0){

            if (instruction.command === CommandConstants.exec){

                if (instruction.name === FreeswitchDpConstants.sleep){

                    let timeout = this._context.serviceModel.timeConversion.secondsToMS(Number(instruction.pauseAttribute.length));
                    
                    connection.execute(instruction.name,
                        timeout, () => {

                        totalCount--;

                        this.executeInstruction(() => {
                            callback();
                        });
                    });
                }
                else if (instruction.name === FreeswitchDpConstants.playback){

                    connection.execute(instruction.name, instruction.value, () => {

                        totalCount--;

                        this.executeInstruction(() => {
                            callback();
                        });
                    });

                }
                else if (instruction.name === FreeswitchDpConstants.speak){

                    connection.execute(instruction.name,
                        `flite|kal|${instruction.value}` , () => {

                        totalCount--;

                        this.executeInstruction(() => {
                            callback();
                        });
                    });
                }
                else if (instruction.name === FreeswitchDpConstants.play_and_get_digits){

                    this.executePLAGD(instruction, () => {

                        totalCount--;

                        if (this._context.plagdResult.plagdStop){

                            this._context.webhookParam = {
                                actionUrl: instruction.gatherAttribute.action,
                                httpMethod: instruction.gatherAttribute.method
                            };

                            this.processedInstruction(() => {
                                callback(this._context);
                            });

                            return;
                        }
                        else{

                            this.executeInstruction(() => {
                                callback();
                            });

                        }

                    });

                }
                else if (instruction.name === FreeswitchDpConstants.hangup){

                    this._context.callRejected = true;

                    totalCount--;

                    this.executeInstruction(() => {
                        callback();
                    });
                }
                else if (instruction.name === FreeswitchDpConstants.bridge){

                    if (instruction.dialAttribute.recordCondition === 'record-from-answer'){

                        connection.execute('set', 'hangup_after_bridge=true', () => {
                            connection.execute('export',
                            'execute_on_answer=record_session $${recordings_dir}/${uuid}.mp3',
                            () => {

                            if (instruction.children != null &&
                                instruction.children.name === 'Number' ){

                                let callForwardingNumber = instruction.value;

                                console.log('Call Forwarding Number -> ', callForwardingNumber);

                                let gateway = `sofia/gateway/fs-test3/1000`;

                                connection.execute(instruction.name, gateway, (cb) => {

                                    this._context.webhookParam = {
                                        actionUrl: instruction.dialAttribute.action,
                                        httpMethod: instruction.dialAttribute.method
                                    };

                                    this._context.bridgeExecuted = true;

                                    callback(this._context);

                                    return;
                                });
                            }
                            });
                        });
                    }
                }

            }
            else if (instruction.command === CommandConstants.axios){

                totalCount--;

                this._context.webhookParam = {
                    actionUrl: instruction.value,
                    httpMethod: null
                };

                this.processedInstruction(() => {
                    callback(this._context);
                });
            }

        }
        else{
            this._context.callRejected = true;

            callback();
        }
    }
}