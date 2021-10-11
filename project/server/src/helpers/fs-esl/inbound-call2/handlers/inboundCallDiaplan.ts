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

                    console.log('callModel ', context.inboundESLConnResult.callModel);
                }
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

                this._context.redisServer.set(this._context.redisServerName,
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

                    // this.getInstruction(this._context,(response) => {

                    //     this.parseInstruction(response);

                    //     this.executeInstruction(() => {
                    //         callback(this._context);
                    //     });
                    // });
    
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

        console.log('List -> ', dialplanInstructionList);

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

                            // callback(this._context);

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

    setInstruction(twiMLResponse:string, context: InboundCallContext){

        let parseResult = new TwiMLXMLParser(null).tryParse(twiMLResponse);

        let gatherInstructionExists: boolean = false;

        if (parseResult.length <= 0 ){
            context.instructionValidated = false;
            return;
        }

        for (let i = 0; i < parseResult.length; i++){

            let instruction = parseResult[i];

            if (instruction.command === CommandConstants.exec){

                let hasGatherInstruction = parseResult.find((i) => i.name === FreeswitchDpConstants.play_and_get_digits);

                let hasDialInstruction = parseResult.find((i) => i.name === FreeswitchDpConstants.bridge);

                if (hasGatherInstruction){
                    gatherInstructionExists = true;
                }

                if (gatherInstructionExists){
                    if (instruction.name === FreeswitchDpConstants.play_and_get_digits){
                        context.dialplanInstruction = instruction;
                        context.instructionOrder = 1;
                        break;
                    }
                }
                
                if (instruction.name === FreeswitchDpConstants.hangup){
                    context.dialplanInstruction = instruction;
                    context.callRejected = true;
                    break;
                }

                if (hasDialInstruction){
                    if (instruction.name === FreeswitchDpConstants.bridge){
                        instruction.order = 2;
                        context.dialplanInstructions.push(instruction);
                        context.isLastDialplan=true;
                    }
                    else if (instruction.name === FreeswitchDpConstants.playback){
                        instruction.order = 1;
                        context.dialplanInstructions.push(instruction);
                    }
                }

                if (!hasDialInstruction &&
                    !hasGatherInstruction){

                    if (instruction.name === FreeswitchDpConstants.speak){
                        context.dialplanInstructions.push(instruction);
                        context.isLastDialplan = true;
                    }
                }
              
            }
        }

        context.instructionValidated = context.callRejected ? false : true;
    }

    executeLastDialplanInstruction(context:InboundCallContext, callback){

        let connection = context.connection;

        let size = context.dialplanInstructions.length;

        context.logger.info(`executeLastDialplanInstruction 3 -> ${JSON.stringify(context.webhookParam)}`);

        context.Log(`size -> ${size}`);

        if (size === 2){

            let instruction = context.dialplanInstructions[0];
            

            if (instruction.order === 1){
                context.logger.info(`validate playback`);
                if (instruction.name === FreeswitchDpConstants.playback){
                    connection.execute(instruction.name, instruction.value, () => {
                        context.Log('Playback executed');

                        instruction = context.dialplanInstructions[1];

                        context.webhookParam = {
                            actionUrl: instruction.dialAttribute.action,
                            httpMethod : instruction.dialAttribute.method
                        }

                        context.inboundESLConnResult = {
                            callModel : {
                                webhookParam: context.webhookParam,
                                callDirection: "inbound",
                                requestParam: context.requestParam,
                                callRejected:false,
                                legId:context.legId
                            }
                        }

                        context.logger.info(`CB -> ${JSON.stringify(context.inboundESLConnResult)}`);

                        connection.execute('set', 'hangup_after_bridge=true', () => {

                            connection.execute('export', 
                            'execute_on_answer=record_session $${recordings_dir}/${uuid}.mp3', () => {

                                if (instruction.children != null &&
                                    instruction.children.name === 'Number'){
                                        
                                    let callForwardingNumber = instruction.value;

                                    connection.execute(instruction.name, `sofia/gateway/fs-test3/1000`, () =>{

                                        context.Log('Bridge executed');

                                        callback(context);

                                        return;
                                    });
                                }
                            });
                            
                        });

                        callback(context);
                    });
                }
            }
        }
        else
        {
            connection.execute('speak', `flite|kal|${context.dialplanInstructions[0].value}`, () =>{

                context.logger.info('speak executed');

                context.callRejected = true;

                context.errorMessage.push(context.dialplanInstruction[0].value);

                callback(context);
            });
        }
    }
}