import { CommandConstants } from "src/helpers/constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "src/helpers/constants/freeswitchdp.constants";
import { TwiMLXMLParser } from "src/helpers/parser/xmlParser";
import { WebhookUrlHelper } from "../../webhookUrl.helper";
import { OutboundCallContext } from "../models/outboundCallContext";
import { CallRejectedHandler } from "./callRejectedHandler";
import { DialEnd } from "./dialEnd";

export class DialConfirm{

    constructor(
        private readonly _context: OutboundCallContext,
        private readonly twiMLParser = new TwiMLXMLParser(_context.redisServer),
        private readonly callRejectedHandler = new CallRejectedHandler(_context),
        private readonly webhookHelper = new WebhookUrlHelper()
    ){}

    dialConfirm(){

        this.getInstruction((response) => {

            if (this._context.callRejected){

                this.callRejectedHandler.reject(() => {
                });

                return;
            }

            this.parseInstruction(response);

            this.executeInstruction(() => {

                if (this._context.callRejected){

                    this.callRejectedHandler.reject(() => {
                    });

                    return;
                }

                if (this._context.bridgeExecuted){

                    new DialEnd(this._context,
                        this.callRejectedHandler,
                        this.webhookHelper)
                    .dialEnd();
                }
            });
        });
    }

    //#region Private

    private getInstruction(callback){

        this.webhookHelper.triggerWebhook(this._context.webhookParam.actionUrl, 
            this._context.webhookParam.httpMethod, 
            this._context.outboundRequestParam, (response) => {

            if (response.Error){

                this._context.legStop = true;

                this._context.callRejected = true;

                this._context.errMessage.push(response.ErrorMessage);

                return callback();
            }
            else{
                
                callback(response.Data);
            }
        });
    }

    private parseInstruction(response:string){

        let parseInstruction = this.twiMLParser.tryParse(response);

        this._context.dpInstructions = parseInstruction;
    }

    private executeInstruction(callback){

        let dialplanInstructionList = this._context.dpInstructions;

        if (dialplanInstructionList.length === 0){

            this._context.errMessage.push("No instructions found");

            this._context.callRejected = true;

            this.callRejectedHandler.reject(() => {
            });

            return;
        }

        let totalCount = dialplanInstructionList.length;

        this._context.Log(`Total instructions to be executed : ${totalCount}`);

        let connection = this._context.connection;

        let instruction = dialplanInstructionList.shift();

        if (totalCount > 0){

            if (instruction.command === CommandConstants.exec){

                if (instruction.name === FreeswitchDpConstants.speak){

                    connection.execute(instruction.name,
                        `flite|kal|${instruction.value}`, () => {

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

    //#endregion
}