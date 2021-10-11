import axios from "axios";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { CommandConstants } from "../../constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "../../constants/freeswitchdp.constants";
import { TwiMLXMLParser } from "../../parser/xmlParser";
import { InboundEslConnResult } from "../inbound-esl.connection";
import { InboundCallContext } from "./models/inboundCallContext";
import { PlayAndGetDigitsParam } from "./models/plagdParam";
import { VoiceRequestParam } from "../models/voiceRequestParam";
import { WebhookUrlHelper } from "../webhookUrl.helper";
import { CallRejectedHandler } from "./handlers/callRejectedHandler";

export class InboundCallDialplan{

    /**
     *
     */
    constructor(
        private readonly _context: InboundCallContext,
        private readonly _webhookHelper = new WebhookUrlHelper(),
        private readonly _callRejectedHandler = new CallRejectedHandler(),
    ) {}

    executeNextInstruction(callback){

        let context = this._context;

        this.executeFirstInstruction(context,(result) => {
            
            if (result.legStop){
                context.Log(`Leg has stop. Cannot continue to process further instructions.`, true);
                callback();
                return;
            }

            //continue to secondInstruction
            context.webhookParam = {
                actionUrl : context.dialplanInstruction.gatherAttribute.action,
                httpMethod: context.dialplanInstruction.gatherAttribute.method
            };

            this.getInstruction(context, () => {

                if (context.callRejected){


                    return;
                }

                context.logger.info(`TwiML Response 2 => ${context.twiMLResponse}`);

                this.setSecondInstruction(context.twiMLResponse, context);

                if (context.instructionValidated){

                    this.executeSecondInstruction(context, () =>{

                        if (context.callRejected){
                            this.callRejectedHandler(context, () => {
                                context.Log(`Call has rejected -> ${context.errorMessage}`, true);
                                return;
                            });
                        }

                        if (context.legStop){
                            context.Log('Leg has stop.',true);
                            callback();
                            return;
                        }

                        //continue to third instructions

                        this.getInstruction(context, () =>{

                            if (context.callRejected){
                                context.Log(`Error. Cannot process further instructions. ${context.errorMessage}`);
                                callback();
                                return;
                            }

                            context.logger.info(`TwiML Response 3 -> ${context.twiMLResponse}`);

                            this.setThirdInstruction(context.twiMLResponse, context);

                            if (context.instructionValidated){
                                if (context.isLastDialplan)
                                {
                                    this.executeLastDialplanInstruction(context, () => {

                                        if (context.callRejected){
                                            this.callRejectedHandler(context, () => {
                                                context.Log('Call has rejected');
                                                callback(context);
                                            });
                                        }
                                        context.logger.info('All instructions are executed');
                                        callback(context);
                                    });
                                }
                                else
                                {
                                    //ignore..
                                }
                            }
                        });
                    });
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

        // this.triggerWebhookUrl(context.webhookParam.actionUrl, 
        //     context.webhookParam.httpMethod, context.voiceRequestParam, (twiMLResponse) => {
        //     context.twiMLResponse = twiMLResponse;
        //     callback(context);
        // })
        // .catch((err) => {
        //     let errMessage = 'Error in requesting webhook url -> ' + err;
        //     // context.logger.info(errMessage);
        //     this.callRejectedHandler(context, () => {
        //         context.callRejected = true;
        //         context.errorMessage = errMessage;
        //         callback(context);
        //     });
        // });
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

    //#region FIRST INSTRUCTION DIALPLAN

    private executeFirstInstruction(
        context:InboundCallContext,
        callback){
        
        let connection = context.connection;

        let PLAGD = this.setPlayAndGetDigits(context);

        connection.execute(context.dialplanInstruction.name,
            `${PLAGD.minValue} ${PLAGD.maxValue} ${PLAGD.tries} ${PLAGD.timeout} ${PLAGD.terminator} ${PLAGD.soundFile} ${PLAGD.invalidFile} ${PLAGD.var_name} ${PLAGD.regexValue}`, 
            (e) => {

            let inputtedDigit = e.getHeader(`variable_${PLAGD.var_name}`);

            if (inputtedDigit === PLAGD.regexValue){
                context.requestParam.Digits = inputtedDigit;
                callback(context);
            }
            else
            {
                this.callRejectedHandler(context, () => {
                    context.Log('Call rejected', true);
                    callback(context);
                })
            }
        });
    }

    private setPlayAndGetDigits(context:InboundCallContext):PlayAndGetDigitsParam{

        let timeout = new TimeConversion().secondsToMS(Number(context.dialplanInstruction.gatherAttribute.timeout));

        return {
            minValue: 1,
            maxValue: 11,
            tries : 2,
            timeout: timeout,
            terminator: '#',
            soundFile : 'ivr/ivr-enter_destination_telephone_number.wav',
            invalidFile: 'ivr/ivr-that_was_an_invalid_entry.wav',
            regexValue: context.dialplanInstruction.gatherAttribute.numDigits,
            var_name : 'inboundCall_target_num'
        };
    }

    //#endregion

    //#region SECOND INSTRUCTION DIALPLAN

    private setSecondInstruction(twiMLResponse:string, context:InboundCallContext){

        let parseResult = new TwiMLXMLParser(null).tryParse(twiMLResponse);

        if (parseResult.length <= 0 ){
            context.instructionValidated = false;
            return;
        }

        for (let i = 0; i <parseResult.length; i++){
            let instruction = parseResult[i];

            if (instruction.command === CommandConstants.axios){

                instruction.order = 2;

                context.dialplanInstructions.push(instruction);
            }
            else if (instruction.command === CommandConstants.exec){

                if (instruction.name === FreeswitchDpConstants.speak){

                    instruction.order = 1;

                    context.dialplanInstructions.push(instruction);
                }
                else if (instruction.name === FreeswitchDpConstants.hangup){

                    instruction.order = 2;

                    context.dialplanInstructions.push(instruction);
                }
            }
        }

        context.instructionValidated = true;
    }

    private executeSecondInstruction(
    context:InboundCallContext,
    callback){

        let connection = context.connection;
        
        let instructionSize = context.dialplanInstructions.length;

        if (instructionSize >= 1) {

            let instruction = context.dialplanInstructions[0];

            connection.execute('speak', `flite|kal|${instruction.value}`, () => {

                context.logger.info('speak executed');

                instruction = context.dialplanInstructions[1];

                if (instruction.command === CommandConstants.axios){

                    context.webhookParam = {
                        actionUrl: instruction.value,
                        httpMethod : null
                    };

                    context.dialplanInstruction = instruction;

                    callback(context);
                }
                else if (instruction.command === CommandConstants.exec){

                    if (instruction.name === FreeswitchDpConstants.hangup){
                        context.callRejected = true;
                    }
                    context.dialplanInstruction = instruction;
                    callback(context);
                }
            });
        }
        else
        {
            console.log('No instruction to handle');
        }

    }

    //#endregion

   //#region SECOND INSTRUCTION DIALPLAN

    private setThirdInstruction(twiMLResponse:string,context:InboundCallContext){

        context.dialplanInstructions = [];

        let parseResult = new TwiMLXMLParser(null).tryParse(twiMLResponse);

        if (parseResult.length <= 0){
            context.instructionValidated = false;
            return;
        }

        for (let i = 0; i < parseResult.length; i++){

            let instruction = parseResult[i];

            if (instruction.command == CommandConstants.exec){

                if (instruction.name === FreeswitchDpConstants.playback){
                    instruction.order = 1;
                    context.dialplanInstructions.push(instruction);
                }
                else if (instruction.name === FreeswitchDpConstants.bridge){
                    instruction.order = 2;
                    context.isLastDialplan=true;
                    context.dialplanInstructions.push(instruction);
                }
                else if (instruction.name === FreeswitchDpConstants.speak){
                    context.dialplanInstructions.push(instruction);
                }
            }
        }

        context.instructionValidated = true;
    }

    //#endregion

    async triggerWebhookUrl(
        webhookUrl:string,
        httpMethod:string,
        params: VoiceRequestParam,
        callback
    ){
        let record = null;

        if (httpMethod === "POST"){
            record = await axios.post(webhookUrl, params);
        }
        else{
            record = await axios.get(webhookUrl, { params: params });
        }

        callback(record.data);
    }

    callRejectedHandler(context:InboundCallContext, callback){
        let connection = context.connection;

        connection.execute('playback', 'ivr/ivr-call_cannot_be_completed_as_dialed.wav', () => {

            connection.execute('hangup', 'CALL_REJECTED', () => {
                context.callRejected = true;
                callback();
            });
        });
    }
}