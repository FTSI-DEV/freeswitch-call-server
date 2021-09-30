import axios from "axios";
import { parse } from "path/posix";
import { CommandConstants } from "src/helpers/constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "src/helpers/constants/freeswitchdp.constants";
import { TwiMLXMLParser } from "src/helpers/parser/xmlParser";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { OutboundCallContext } from "../models/outboundCallContext";

export class DialInputFailed{

    constructor(
        private readonly _context: OutboundCallContext,
        private readonly twiMLParser : TwiMLXMLParser,
        private readonly timeConversion : TimeConversion
    ){}

    userDialInputFailed(){

        this.getInstruction((response) => {

            if (this._context.callRejected){

                this.callRejectedHandler(this._context, () => {
                    console.log('Call has been rejected');
                });
                return;
            }

            this.parseInstruction(response);

            this.executeInstruction(() => {

                if (this._context.callRejected){
                    this.callRejectedHandler(this._context, () => {
                        console.log('Call has been rejected');
                    });

                    return;
                }

            });

        });
    }
    
    private executeInstruction(callback){

        let dialplanInstructionList = this._context.dpInstructions;

        let connection = this._context.connection;

        if (dialplanInstructionList.length === 0){
            console.log('Call must be rejected');
            console.log('Total -> ', dialplanInstructionList.length);
            this._context.callRejected = true;
            callback();
            return;
        }

        let totalCount = dialplanInstructionList.length;

        console.log('Total instructions to be executed -> ', totalCount);

        let instruction = dialplanInstructionList.shift();

        if (totalCount > 0){

            if (instruction.command === CommandConstants.exec){

                if (instruction.name === FreeswitchDpConstants.sleep){

                    let timeout = this.timeConversion.secondsToMS(Number(instruction.pauseAttribute.length));

                    connection.execute(instruction.name, timeout, () => {

                        console.log('Sleep executed');
                        totalCount--;

                        this.executeInstruction(() => {
                            callback();
                        });
                    });
                }
                else if (instruction.name === FreeswitchDpConstants.speak){

                    connection.execute(instruction.name,
                        `flite|kal|${instruction.value}` , () => {

                        console.log('Speak Executed');
                        totalCount--;
                        this.executeInstruction(() => {
                            callback();
                        });
                    });
                }
                else if (instruction.name === FreeswitchDpConstants.hangup){

                    this._context.callRejected = true;
                    totalCount--;
                    this.executeInstruction(() => {
                        callback();
                    });
                }
            }
        }
        else{
            this._context.callRejected = true;
            callback();
        }
    }

    private getInstruction(callback){

        console.log('Dial Failed ', this._context.requestParam.ActionId);

        this.triggerWebhookUrl(this._context.webhookParam.actionUrl, 
            this._context.webhookParam.httpMethod, 
            this._context.requestParam, (response) => {

            if (this._context.callRejected){
                return callback();
            }

            callback(response);
        });
    }
    
    private parseInstruction(response:string){

        let parseInstruction = this.twiMLParser.tryParse(response);

        this._context.dpInstructions = parseInstruction;
    }

    private async triggerWebhookUrl(url:string,method:string,params:any,callback){

        let record = null;

        try
        {
            if (method === 'POST'){
                record = await axios.post(url, params);
            }
            else
            {
                record = await axios.get(url, { params : params } );
            }

            callback(record.data);
        }
        catch(err){
            this._context.callRejected;
            callback();
            // this.callRejectedHandler(this._context, () => {
            //     callback();
            // });
        }
    }

    callRejectedHandler(context:OutboundCallContext, callback){
        let connection = context.connection;

        connection.execute('playback', 'ivr/ivr-call_cannot_be_completed_as_dialed.wav', () => {

            this._context.redisServer.del(this._context.redisServerName, (err,reply) => {
                console.log('Deleted -> ', reply);
            });

            connection.execute('hangup', 'CALL_REJECTED', () => {
                context.callRejected = true;
                // context.dpInstructions = [];
                callback();
            });
        });
    }

}