import { ContextIdFactory } from "@nestjs/core";
import axios from "axios";
import { CHANNEL_VARIABLE } from "src/helpers/constants/channel-variables.constants";
import { CustomAppLogger } from "src/logger/customLogger";
import { http } from "winston";
import { InboundEslConnResult } from "../inbound-esl.connection";
import { ChannelStateModel, OutboundCallContext } from "./models/outboundCallContext";
import redis from 'redis';
import { DialplanInstruction, TwiMLXMLParser } from "src/helpers/parser/xmlParser";
import { CommandConstants } from "src/helpers/constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "src/helpers/constants/freeswitchdp.constants";
import { connect } from "http2";
import { PlayAndGetDigitsParam } from "../inbound-call/models/plagdParam";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { DialVerify } from "./handlers/dialVerify";

export class OutboundCallHelper{

    private readonly _logger = new CustomAppLogger(OutboundCallHelper.name);
    private readonly _inboundEslConn = InboundEslConnResult;

    constructor(
        private _context: OutboundCallContext
    ){}

    outboundCallEnter(){

        let server = this._context.server;

        let context = this._context;

        server.on('connection::ready', (conn) => {

            console.log('OutboundCall Server ready');

            context.connection = conn;
            
            let legId = conn
                .getInfo()
                .getHeader(CHANNEL_VARIABLE.UNIQUE_ID);

            let channelStateModel: ChannelStateModel = {
                legId : legId,
                channelState : conn.getInfo().getHeader('Channel-State'),
                answerState: conn.getInfo().getHeader('Answer-State')
            };

            context.redisServer.set(context.redisServerName, JSON.stringify(channelStateModel), (err,reply) => {
                console.log('Redis State Saved! -> ', reply);
            });

            context.redisServer.get(context.redisServerName, (err,reply) => {
                console.log('Retrieve from REDIS ! -> ', reply);
            });

            if (channelStateModel.answerState === 'hangup'){
                return;
            }

            let phoneNumberFrom = conn
                .getInfo()
                .getHeader(CHANNEL_VARIABLE.CALLER_CALLE_ID_NUMBER);

            conn.on('error', (err) => {
                console.log('Error -> ', err);
            });

            context.requestParam.From = phoneNumberFrom;

            context.serviceModel.callDetailRecordSrvc
                .getByCallUid(legId)
                .then((result) => {

                if (result === undefined){
                    console.log('error -> leg must stop.');
                }

                new DialVerify(this._context).dialVerify();

                // this.getInstruction(context, (response) => {
                //     console.log('Response -> ', response);

                //     this.parseInstruction(context, response, () => {
                //         this.executeInstruction(context, () => {

                //         })
                //     });
                // });

            })
            .catch((error) => {
                console.log('Error -> ', error);
            });
        });
    }

    private setPlayAndGetDigits(context:OutboundCallContext, nextInstruction:DialplanInstruction):PlayAndGetDigitsParam{

        let timeout = new TimeConversion().secondsToMS(Number(nextInstruction.gatherAttribute.timeout));

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

    private executeInstruction(context:OutboundCallContext,callback){

        let instruction = context.dpInstructions.pop();

        if (instruction.command === CommandConstants.exec){
           
            if (instruction.name === FreeswitchDpConstants.sleep){
                
                context.connection.execute(instruction.name, instruction.pauseAttribute.length, () => {
                    console.log('Instruction executed ', instruction.name);
                    
                    instruction = context.dpInstructions.pop();

                    console.log('next -> ', instruction);

                    if (instruction.name === FreeswitchDpConstants.play_and_get_digits){

                        let PLAGD = this.setPlayAndGetDigits(context,instruction);

                        context.connection.execute(instruction.name,
                            `${PLAGD.minValue} ${PLAGD.maxValue} ${PLAGD.tries} ${PLAGD.timeout} ${PLAGD.terminator} ${PLAGD.soundFile} ${PLAGD.invalidFile} ${PLAGD.var_name} ${PLAGD.regexValue}`, 
                            (cb) => {
                                console.log('play and get digits');

                                let inputtedDigit = cb.getHeader(`variable_${PLAGD.var_name}`);
                                
                                if (inputtedDigit === PLAGD.regexValue){
                                    console.log('child -> ', instruction.children);

                                    if (instruction.children.name === FreeswitchDpConstants.speak){
    
                                        context.connection.execute('speak', `flite|kal|${instruction.children.value}`, () => {
                                            console.log('speak executed');
                                        });
                                    }
                                }
                                else
                                {
                                    instruction = context.dpInstructions.pop();

                                    if (instruction.command === CommandConstants.exec){
                                        if (instruction.name === FreeswitchDpConstants.speak){
                                            
                                            context.connection.execute(instruction.name, `flite|kal|${instruction.value}`, () => {
                                                console.log('speak executed');

                                                instruction = context.dpInstructions.pop();

                                                context.connection.execute(instruction.name, new TimeConversion().secondsToMS(Number(instruction.pauseAttribute.length.length)), () => {
                                                    console.log('sleep executed');

                                                    instruction = context.dpInstructions.pop();
                                                    PLAGD = this.setPlayAndGetDigits(context,instruction);

                                                    context.connection.execute(instruction.name,
                                                        `${PLAGD.minValue} ${PLAGD.maxValue} ${PLAGD.tries} ${PLAGD.timeout} ${PLAGD.terminator} ${PLAGD.soundFile} ${PLAGD.invalidFile} ${PLAGD.var_name} ${PLAGD.regexValue}`,
                                                        (cb) => {

                                                        console.log('play and get digits');

                                                        let inputtedDigit = cb.getHeader(`variable_${PLAGD.var_name}`);

                                                        if (inputtedDigit === PLAGD.regexValue){

                                                        }
                                                        else
                                                        {
                                                            instruction = context.dpInstructions.pop();

                                                            console.log('instr', instruction);

                                                            if (instruction.name === FreeswitchDpConstants.speak){
    
                                                                context.connection.execute('speak', `flite|kal|${instruction.value}`, () => {
                                                                    console.log('speak executed');

                                                                    instruction = context.dpInstructions.pop();

                                                                    console.log('instr1', instruction);

                                                                    context.connection.execute(instruction.name, new TimeConversion().secondsToMS(Number(instruction.pauseAttribute.length.length)), () => {
                                                                        console.log('sleep executed');

                                                                        instruction = context.dpInstructions.pop();

                                                                        console.log('dp -> ' , JSON.stringify(instruction));

                                                                        PLAGD = this.setPlayAndGetDigits(context, instruction);

                                                                        context.connection.execute(instruction.name, 
                                                                            `${PLAGD.minValue} ${PLAGD.maxValue} ${PLAGD.tries} ${PLAGD.timeout} ${PLAGD.terminator} ${PLAGD.soundFile} ${PLAGD.invalidFile} ${PLAGD.var_name} ${PLAGD.regexValue}`,
                                                                            (cb) => {

                                                                            console.log('play and get digits');

                                                                            let inputtedDigit = cb.getHeader(`variable_${PLAGD.var_name}`);

                                                                            if (inputtedDigit === PLAGD.regexValue){

                                                                            }
                                                                            else{

                                                                                instruction = context.dpInstructions.pop();

                                                                                console.log('instruction -> ', instruction);

                                                                                console.log('all -> ' , context.dpInstructions);

                                                                                context.requestParam.ActionId = 236;
                                                                                this.triggerWebhookUrl(instruction.value, 'POST', context.requestParam, (response) => {
                                                                                    console.log('result -> ', response );

                                                                                    if (context.dpInstructions.length !== 0){
                                                                                        //handle here
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        //parse here
                                                                                        let parseResult = new TwiMLXMLParser(context.redisServer).tryParse(response);

                                                                                        if (parseResult.length === 0){

                                                                                        }
                                                                                        else
                                                                                        {
                                                                                            //execute
                                                                                            let nextInstruction = parseResult.pop();

                                                                                            context.connection.execute(nextInstruction.name, 1000, () => {
                                                                                                console.log('sleep executed');
                                                                                                nextInstruction = parseResult.pop();
                                                                                                context.connection.execute(nextInstruction.name, `flite|kal|${nextInstruction.value}`, () => {
                                                                                                    console.log('speak executed');
                                                                                                    console.log('all -> ' , parseResult);
                                                                                                    nextInstruction = parseResult.pop();
                                                                                                    context.connection.execute(nextInstruction.name, 'CALL_REJECTED', () => {
                                                                                                        console.log('call rejectred');
                                                                                                    });
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }
                        
                                                                        });
                                                                    });
                                                                });
                                                            }
                                                        }
                                                            
                                                 });
                                                });
                                                
                                            });
                                        }
                                    }
                                }
                        });
                    }
                });
            }

            // context.connection.execute(instruction.name, instruction.value, () => {
            //     console.log('Instruction executed! -> ', instruction.name);

            //     instruction = context.dpInstructions.pop();

            // });
        }
    }

    private parseInstruction(context:OutboundCallContext, value:string, callback){

        let parseResult = new TwiMLXMLParser(context.redisServer).tryParse(value);

        context.dpInstructions = parseResult;

        callback();
    }

    private getInstruction(context:OutboundCallContext,callback){

        let urlOutboundDialVerify = 'http://localhost:8080/TwilioCallApi/DialVerify';

        this.triggerWebhookUrl(urlOutboundDialVerify, 'POST', context.requestParam, (response) => {

            this.redisSet('twimlResponse', response, context, () => {
                console.log('Redis set!');
            });

           this.redisGet('twimlReponse', context, () => {
                console.log('Retrieve value from REDIS');
           });


           callback(response);
        });
    }

    private redisSet(name:string, value:any, context:OutboundCallContext, callback){
        context.redisServer.set(name,value,(err,reply) => {
            console.log(reply);
            callback(err,reply);
        });
    }

    private redisGet(name:string, context:OutboundCallContext, callback){
        context.redisServer.get(name, (err,reply) => {
            console.log(reply);
            callback(err,reply);
        });
    }

    private async triggerWebhookUrl(url:string,method:string,params:any,callback){
        let record = null;


        if (method === 'POST'){
            record = await axios.post(url, params);
        }
        else
        {
            record = await axios.get(url, { params : params } );
        }

        callback(record.data);
    }
}