import { exec } from "child_process";
import { time } from "console";
import { CallTypes } from "src/helpers/constants/call-type";
import { CommandConstants } from "src/helpers/constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "src/helpers/constants/freeswitchdp.constants";
import { DialplanInstruction, TwiMLXMLParser } from "src/helpers/parser/xmlParser";
import { WebhookUrlHelper } from "../../webhookUrl.helper";
import { InboundCallContext } from "../models/inbound-call-context.model";
import { PlayAndGetDigitsParamModel } from "../models/plagd-param.model";

export class InboundCallDialplanHelper{

    constructor(
        private readonly _context: InboundCallContext,
        private readonly _twiMLParser = new TwiMLXMLParser(_context.redisServer)
    ){}

    processedInstruction(callback){

        let context = this._context;

        this.getInstruction(context, (response) => {

            if (context.callRejected){
                context.serviceModel
                .callRejectedHandler.reject(context, () => {});

                return;
            }

            this.parseInstruction(response);

            this.executeInstruction(() => {

                console.log('finished executing instruction...');

                if (this._context.callRejected){
                    this._context.serviceModel.callRejectedHandler
                        .reject(this._context, () => {});
                    return;
                }

                if (this._context.bridgeExecuted){

                    context.inboundEslConnResult = {
                        callModel : {
                            webhookParam: context.webhookParam,
                            callDirection: CallTypes.Inbound,
                            requestParam: context.inboundRequestParam,
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

        context.serviceModel.webhookUrlHelper
            .triggerWebhook(
                context.webhookParam.actionUrl,
                context.webhookParam.httpMethod,
                context.inboundRequestParam,
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
            });

    }

    parseInstruction(response:string){

        let parseInstruction = this._twiMLParser.tryParse(response);

        this._context.dialplanInstructions = parseInstruction;

        console.log('Instruction Parsed! -> ', parseInstruction);
    }

    executeInstruction(callback){

        let dialplanInstructionList = this._context.dialplanInstructions;

        let totalCount = dialplanInstructionList.length;

        if (totalCount === 0){

            this._context.callRejected = true;

            this._context.errorMessage.push(`LegId: ${this._context.legId} , 
                    No instruction found.`);

            this._context.serviceModel
                .callRejectedHandler.reject(this._context, () => { callback () });

            return;
        }

        console.log('Total Count -> ', totalCount);

        let connection = this._context.connection;

        let instruction = dialplanInstructionList.shift();

        if (totalCount > 0){

            if (instruction.command === CommandConstants.exec) {

                if (instruction.name === FreeswitchDpConstants.sleep){

                    let timeout = this._context.serviceModel.timeConversion
                        .secondsToMS(Number(instruction.pauseAttribute.length));

                    connection.execute(instruction.name,
                        timeout, () => {

                        totalCount--;

                        this.executeInstruction(() => {
                            callback();
                        });
                    })
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
                    this._context.inboundRequestParam.Digits = inputtedDigit;
                    
                    this._context.plagdResult.plagdStop = true;

                    this._context.webhookParam = {
                        actionUrl: instruction.gatherAttribute.action,
                        httpMethod:instruction.gatherAttribute.method
                    };
    
                    callback(this._context);
                }

        });
    }

    private setPLAGD(instruction:DialplanInstruction):PlayAndGetDigitsParamModel{

        let timeout = this._context.serviceModel.timeConversion
            .secondsToMS(Number(instruction.gatherAttribute.timeout));

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
}