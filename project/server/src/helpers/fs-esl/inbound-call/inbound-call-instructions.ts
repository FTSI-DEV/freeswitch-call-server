import axios from "axios";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { CommandConstants } from "../../constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "../../constants/freeswitchdp.constants";
import { TwiMLXMLParser } from "../../parser/xmlParser";
import { InboundCallHelper } from "./inbound-call";
import { InboundCallContext } from "./models/inboundCallContext";
import { PlayAndGetDigitsParam } from "./models/plagdParam";
import { VoiceRequestParam } from "./models/voiceRequestParam";

export class InboundCallDialplan{

    executeNextInstruction(context:InboundCallContext,callback){

        this.executeFirstInstruction(context,(result) => {
            if (result.legStop){
                console.log('Leg has stop. Cannot continue to process further instructions.');
                callback();
                return;
            }

            //continue to secondInstruction
            context.webhookParam = {
                actionUrl : context.dialplanInstruction.gatherAttribute.action,
                httpMethod: context.dialplanInstruction.gatherAttribute.method
            };

            this.getInstruction(context, () => {

                if (context.hasError){
                    console.log('Error. Cannot continue to process the further instructions.');
                    console.log('error message -> ', context.errorMessage);
                    return;
                }

                console.log('TwiML Response 2 -> ', context.twiMLResponse);

                this.setSecondInstruction(context.twiMLResponse, context);

                if (context.instructionValidated){

                    this.executeSecondInstruction(context, () =>{
                        if (context.legStop){
                            console.log('Leg has stop. Cannot continue to process further instructions.');
                            callback();
                            return;
                        }

                        if (context.callRejected){
                            this.callRejectedHandler(context, () => {
                                console.log('Call has rejected or hangup');
                            });
                        }

                        //continue to third instructions

                        context.webhookParam = {
                            actionUrl: context.dialplanInstruction.value,
                            httpMethod : null
                        };

                        this.getInstruction(context, () =>{
                            if (context.hasError){
                                console.log('Error. Canot continue to process the further instructions.');
                                console.log('error message -> ', context.errorMessage);
                                callback();
                                return;
                            }

                            console.log('TwiML Response 3 -> ', context.twiMLResponse);

                            this.setThirdInstruction(context.twiMLResponse, context);

                            if (context.instructionValidated){
                                if (context.isLastDialplan)
                                {
                                    this.executeLastDialplanInstruction(context, () => {
                                        console.log('All instructions are executed!');
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

    getInstruction(context:InboundCallContext,
        callback){

        this.triggerWebhookUrl(context.webhookParam.actionUrl, 
            context.webhookParam.httpMethod, context.voiceRequestParam, (twiMLResponse) => {
            context.twiMLResponse = twiMLResponse;
            callback(context);
        })
        .catch((err) => {
            let errMessage = 'Error in requesting webhook url -> ' + err;

            console.log(errMessage);
            this.callRejectedHandler(context, () => {
                console.log('Error handled!');
                
                context.hasError = true;
                context.errorMessage = errMessage;

                callback(context);
            });
        });
    }

    setInstruction(twiMLResponse:string, context: InboundCallContext){

        let parseResult = new TwiMLXMLParser().tryParse(twiMLResponse);

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
              
            }
        }

        context.instructionValidated = context.callRejected ? false : true;
    }

    executeLastDialplanInstruction(context:InboundCallContext, callback){

        let connection = context.conn;

        let size = context.dialplanInstructions.length;

        if (size === 2){

            let instruction = context.dialplanInstructions[0];

            if (instruction.order === 1){
                if (instruction.name === FreeswitchDpConstants.playback){
                    connection.execute(instruction.name, instruction.value, () => {
                        console.log('playback executed');

                        instruction = context.dialplanInstructions[1];

                        connection.execute('set', 'hangup_after_bridge=true', () => {

                            connection.execute('export', 
                            'execute_on_answer=record_session $${recordings_dir}/${uuid}.mp3', () => {

                                if (instruction.children != null &&
                                    instruction.children.name === 'Number'){
                                        
                                    let callForwardingNumber = instruction.value;

                                    connection.execute(instruction.name, `sofia/gateway/fs-test3/1000`, () =>{
                                        console.log('bridge executed');
                                        context.dialplanInstruction = instruction;
                                        callback(context);
                                        return;
                                    });
                                }
                            });
                            
                        });
                    });
                }
            }
        }
    }

    //#region FIRST INSTRUCTION DIALPLAN

    private executeFirstInstruction(
        context:InboundCallContext,
        callback){
        
        let connection = context.conn;

        let PLAGD = this.setPlayAndGetDigits(context);

        connection.execute(context.dialplanInstruction.name,
            `${PLAGD.minValue} ${PLAGD.maxValue} ${PLAGD.tries} ${PLAGD.timeout} ${PLAGD.terminator} ${PLAGD.soundFile} ${PLAGD.invalidFile} ${PLAGD.var_name} ${PLAGD.regexValue}`, 
            (e) => {

            let inputtedDigit = e.getHeader(`variable_${PLAGD.var_name}`);

            if (inputtedDigit === PLAGD.regexValue){
                context.voiceRequestParam.Digits = inputtedDigit;
                callback(context);
            }
            else
            {
                this.callRejectedHandler(context, () => {
                    console.log('Call rejected');
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

        let parseResult = new TwiMLXMLParser().tryParse(twiMLResponse);

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

        let connection = context.conn;
        
        let instructionSize = context.dialplanInstructions.length;

        console.log('size ', instructionSize);

        if (instructionSize >= 1) {

            let instruction = context.dialplanInstructions[0];

            connection.execute('speak', `flite|kal|${instruction.value}`, () => {

                console.log('speak executed');

                instruction = context.dialplanInstructions[1];

                console.log('instruction ', instruction);

                if (instruction.command === CommandConstants.axios){
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

        let parseResult = new TwiMLXMLParser().tryParse(twiMLResponse);

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