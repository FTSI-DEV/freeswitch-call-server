import axios from "axios";
import { configService } from "src/config/config.service";
import { InboundCallConfigModel } from "src/modules/inbound-call-config/models/inbound-call-config.model";
import { IInboundCallConfigService } from "src/modules/inbound-call-config/services/inbound-call-config.interface";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { CHANNEL_VARIABLE } from "../constants/channel-variables.constants";
import { CommandConstants } from "../constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "../constants/freeswitchdp.constants";
import { FS_ESL } from "../constants/fs-esl.constants";
import { DialplanInstruction, TwiMLXMLParser } from "../parser/xmlParser";
import { FreeswitchConnectionResult } from "./inbound-esl.connection";
import { inboundCallServer } from "./inboundCall.server";
import { VoiceRequestParam } from "./models/voiceRequestParam";

export class InboundCallHelper{

    constructor(
        private readonly _inboundCallConfigService: IInboundCallConfigService
    ){}

    inboundCallEnter(){

        inboundCallServer.on('connection::ready', async (conn) => {

            console.log('Inbound Call - server ready');

            let context = new InboundCallContext();

            context.conn = conn;

            context.legId = this.getChannelVariable(CHANNEL_VARIABLE.UNIQUE_ID, context);
            
            let phoneNumberFrom = this.getChannelVariable(CHANNEL_VARIABLE.CALLER_CALLER_ID_NUMBER,context);

            let callerDestinationNumber = this.getChannelVariable(CHANNEL_VARIABLE.CALLER_DESTINATION_NUMBER, context);

            console.log('Leg-A' , context.legId );

            this._onListenEvent(context);

            //Play welcome message
            conn.execute('playback', 'https://crm.dealerownedsoftware.com/hosted-files/ivr-rec-2/WelcomeMessage.mp3', () => {
                console.log('Playback executed');

                console.log('callerdest', callerDestinationNumber);
                this._inboundCallConfigService
                .getByCallerId(callerDestinationNumber)
                .then((config) => {

                    console.log('callerid', config.callerId);

                    context.voiceRequestParam.From = phoneNumberFrom;
                    context.voiceRequestParam.To = config.callerId;
                    context.voiceRequestParam.StoreId = 60;
                    context.voiceRequestParam.SystemId = 0;

                    this.parseInstruction(context, config, async (result) => {
                        
                        if (result.hasError){
                            console.log('Error. Cannot continue to process the further instructions.');
                            console.log('error message -> ' , result.errorMessage);
                            return;
                        }

                        console.log('TwiML Response -> ', result.twiMLResponse);

                        this.setInstruction(context.twiMLResponse, context);

                        if (context.callRejected){
                            context.legStop = true;
                            this.callRejectedHandler(context, () => {
                                console.log('Call rejected!');
                                return;
                            });
                        }

                        if (context.instructionValidated){

                            if (context.isLastDialplan){
                                this.executeLastDialplanInstruction(context, () => {
                                    console.log('validated bridge');
                                });
                            }
                            else
                            {
                               this.executeNextInstruction(context, () => {
                                    console.log('All instructions are executed');
                               });
                            }
                        }
                    });
                })
                .catch((err) => {
                    console.log('Error while retrieving records to database.', err);
                    this.callRejectedHandler(context, () => {
                        console.log('Error handled!');
                    });
                });
            });
        });
    }

    private executeNextInstruction(context:InboundCallContext,callback){

        this.executeFirstInstruction(context,(result) => {
            if (result.legStop){
                console.log('Leg has stop. Cannot continue to process further instructions.');
                callback();
                return;
            }

            //continue to secondInstruction
            this.getSecondInstruction(context, () => {

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

                        this.getThirdInstruction(context, () =>{
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
                                    this.executeThirdInstruction(context, () => {
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

    private parseInstruction(context:InboundCallContext,
        config:InboundCallConfigModel, 
        callback){

        this.triggerWebhookUrl(config.webhookUrl, config.httpMethod, context.voiceRequestParam, (twiMLResponse) => {
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

    private setInstruction(twiMLResponse:string, context: InboundCallContext){

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

    private executeLastDialplanInstruction(context:InboundCallContext, callback){

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

        let PLAG = this.setPlayAndGetDigits(context);

        connection.execute(context.dialplanInstruction.name,
            `${PLAG.minValue} ${PLAG.maxValue} ${PLAG.tries} ${PLAG.timeout} ${PLAG.terminator} ${PLAG.soundFile} ${PLAG.invalidFile} ${PLAG.var_name} ${PLAG.regexValue}`, 
            (e) => {

            let inputtedDigit = e.getHeader(`variable_${PLAG.var_name}`);

            if (inputtedDigit === PLAG.regexValue){
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

    private setFirstInstruction(twiMLResponse:string, context: InboundCallContext){

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

                if (hasGatherInstruction){
                    gatherInstructionExists = true;
                }

                if (gatherInstructionExists){
                    if (instruction.name === FreeswitchDpConstants.play_and_get_digits){
                        context.dialplanInstruction = instruction;
                    }
                }
                
                if (instruction.name === FreeswitchDpConstants.hangup){
                    context.dialplanInstruction = instruction;
                    context.callRejected = true;
                    break;
                }
            }
        }

        context.instructionValidated = context.callRejected ? false : true;
    }

    private getFirstInstruction(
        context:InboundCallContext,
        config:InboundCallConfigModel, 
        callback){

        this.triggerWebhookUrl(config.webhookUrl, config.httpMethod, context.voiceRequestParam, (twiMLResponse) => {
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

    //#endregion

    //#region SECOND INSTRUCTION DIALPLAN
    private getSecondInstruction(
        context:InboundCallContext,
        callback
    ){
        this.triggerWebhookUrl(context.dialplanInstruction.gatherAttribute.action,
            context.dialplanInstruction.gatherAttribute.method, 
            context.voiceRequestParam, 
            (twiMLResponse) => {

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
        })
    }

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

    private getThirdInstruction(
        context:InboundCallContext,
        callback
    ){
        this.triggerWebhookUrl(context.dialplanInstruction.value, null, context.voiceRequestParam, (twiMLResponse) => {
            context.twiMLResponse  = twiMLResponse;
            callback(context);
        })
        .catch((err) => {
            this.callRejectedHandler(context, () =>{
                let errMessage = 'Error in requesting webhook url -> ' + err;
                context.hasError = true;
                context.errorMessage = errMessage
                console.log('Handled error' , err);
                callback(context);
            });
        });
    }

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

    private executeThirdInstruction(
        context:InboundCallContext,
        callback
    ){
        let connection = context.conn;

        let size = context.dialplanInstructions.length;

        if (size === 2 ){

            let instruction = context.dialplanInstructions[0];

            if (instruction.name === FreeswitchDpConstants.playback){
                connection.execute(`${instruction.name}`, `${instruction.value}`, () => {
                    console.log('playback executed!');

                    instruction = context.dialplanInstructions[1];

                    if (instruction.name === FreeswitchDpConstants.bridge){

                        if (instruction.dialAttribute.recordCondition === RecordEnum.RecordFromAnswer){

                            connection.execute('set', 'hangup_after_bridge=true', () => {
                                console.log('hangup after bridge set');
                               
                                connection.execute('export',
                                    'execute_on_answer=record_session $${recordings_dir}/${uuid}.wav', () => {
                                    
                                    if (instruction.children != null && 
                                        instruction.children.name === 'Number'){
                                        
                                        let callForwardingNumber = instruction.value;

                                        connection.execute(instruction.name, `sofia/gateway/fs-test3/1000`, (cb) => {
                                            console.log('bridge completed');
                                            console.log('B-LEG', cb.getHeader(CHANNEL_VARIABLE.UNIQUE_ID));
                                            context.legStop = true;
                                            console.log('dp' , instruction);
                                            context.dialplanInstruction = instruction;
                                            callback(context);
                                            return;
                                        });
                                    }
                                });
                            });
                        }
                    }
                });
            }
        }
        else
        {
            let instruction = context.dialplanInstructions[0];
            if (instruction.name === FreeswitchDpConstants.speak){

                connection.execute(instruction.name, `flite|kal|${instruction.value}`, () => {
                    console.log('speak executed!');

                    this.callRejectedHandler(context, () => {
                        context.legStop = true;
                        context.callRejected = true;
                        callback(context);
                    });
                });
            }
        }
    }

    //#endregion

    private callRejectedHandler(context:InboundCallContext, callback){
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

    private async triggerWebhookUrl(
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

    private _onListenEvent(context:InboundCallContext){
        
        let connection = context.conn;

        connection.on('error', (err) => {
            console.log('Inbound Call Error -> ', err);
        });

        connection.send('linger');

        let hangupCompleteEvent = 'esl::event::CHANNEL_HANGUP_COMPLETE::' + context.legId;

        let hangupCompleteWrapper = (evt) => {

            context.legStop = true;

            console.log('Leg-A hangup');

            this.triggerWebhookUrl(context.dialplanInstruction.dialAttribute.action,
                context.dialplanInstruction.dialAttribute.method,
                context.voiceRequestParam, () => {
                    console.log('triggered webhook end call');
            });

            connection.removeListener(hangupCompleteEvent, hangupCompleteWrapper);
        };

        connection.subscribe('CHANNEL_HANGUP_COMPLETE');

        connection.on(hangupCompleteEvent, hangupCompleteWrapper);
    }

    private getChannelVariable(headerName:string,context:InboundCallContext){

        let connection = context.conn;

        return connection.getInfo().getHeader(headerName);
    }
}

class InboundCallContext{
    conn:any;
    voiceRequestParam: VoiceRequestParam = new VoiceRequestParam();
    dialplanInstructions: DialplanInstruction[] = [];
    dialplanInstruction : DialplanInstruction; 
    legStop: boolean = false;
    errorMessage: string;
    hasError: boolean = false;
    twiMLResponse:string;
    instructionValidated: boolean = false;
    callRejected:boolean = false;
    legId:string;
    instructionOrder:number;
    isLastDialplan:boolean=false;
}

interface PlayAndGetDigitsParam{
    minValue:number; //minimum number of digits to collect
    maxValue:number; //maximum number of digits to collect
    tries:number; // number of attempts to play the file and collect the digits
    timeout:number; // number of milliseconds to wait before assuming the caller is done entering the digits
    terminator:string; // digits used to end input
    soundFile:string; // sound file to play while digits are fetched.
    invalidFile:string; // sound file to play when digits don't match the regex
    regexValue:string; // regular expression to match digits
    digit_Timeout?:number; // (optional) number of milliseconds to wait between digits
    var_name:string; // channel variable that digits should be placed in
}

const RecordEnum = {
    DoNotRecord: 'do-not-record',
    RecordFromAnswer: 'record-from-answer',
    RecordFromRinging: 'record-from-ringing',
    RecordFromAnswerDual: 'record-from-answer-dual',
    RecordFromRingingDual: 'record-from-ringing-dual',
};
  