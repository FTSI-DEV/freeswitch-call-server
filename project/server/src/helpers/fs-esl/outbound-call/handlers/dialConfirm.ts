import axios from "axios";
import { CommandConstants } from "src/helpers/constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "src/helpers/constants/freeswitchdp.constants";
import { TwiMLXMLParser } from "src/helpers/parser/xmlParser";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { OutboundCallContext } from "../models/outboundCallContext";
import { DialEnd } from "./dialEnd";

export class DialConfirm{

    constructor(
        private readonly _context: OutboundCallContext,
        private readonly twiMLParser = new TwiMLXMLParser(_context.redisServer),
        private readonly timeConversion = new TimeConversion()
    ){}

    dialConfirm(){

        this.getInstruction((response) => {

            if (this._context.callRejected){
                console.log('Call has been rejected. Cannot process further instructions');
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

                if (this._context.bridgeExecuted){
                    new DialEnd(this._context,
                        this.twiMLParser,
                        this.timeConversion)
                        .dialEnd();
                }

            });
        });
    }

    private getInstruction(callback){

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
            this.callRejectedHandler(this._context, () => {
                callback();
            });
        }
    }

    private executeInstruction(callback){

        let dialplanInstructionList = this._context.dpInstructions;

        if (dialplanInstructionList.length === 0){
            console.log('total -> ', dialplanInstructionList.length);
            console.log('Call must be rejected');
            this._context.callRejected = true;
            this.callRejectedHandler(this._context, () => {
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

                if (instruction.name === FreeswitchDpConstants.speak){

                    connection.execute(instruction.name,
                        `flite|kal|${instruction.value}`, () => {

                        console.log('Speak executed');
                        totalCount--;
                        this.executeInstruction(() => {
                            callback();
                        });
                    });
                }
                else if (instruction.name === FreeswitchDpConstants.hangup){
                    this._context.callRejected=true;
                    totalCount--;
                    callback();
                }
                else if (instruction.name === FreeswitchDpConstants.bridge){

                    if (instruction.dialAttribute.recordCondition === 'record-from-answer'){

                        connection.execute('set', 'hangup_after_bridge=true', () => {

                            connection.execute('export',
                                'execute_on_answer=record_session $${recordings_dir}/${uuid}.mp3',
                            () => {

                                if (instruction.children != null &&
                                    instruction.children.name === 'Number'){
                                    
                                    let callForwardingNumber = instruction.value;

                                    let gateway = `sofia/gateway/fs-test3/1000`;

                                    connection.execute(instruction.name, gateway, (cb) => {

                                        console.log('Bridge executed!');

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

            }
        }
        else
        {
            callback();
        }
    }

    private callRejectedHandler(context:OutboundCallContext, callback){
        let connection = context.connection;

        connection.execute('playback', 'ivr/ivr-call_cannot_be_completed_as_dialed.wav', () => {

            this._context.redisServer.del(this._context.redisServerName, (err,reply) => {
                console.log('Deleted -> ', reply);
            });

            connection.execute('hangup', 'CALL_REJECTED', () => {
                context.callRejected = true;
                callback();
            });
        });
    }
}