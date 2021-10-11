import { CommandConstants } from "src/helpers/constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "src/helpers/constants/freeswitchdp.constants";
import { TwiMLXMLParser } from "src/helpers/parser/xmlParser";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { WebhookUrlHelper } from "../../webhookUrl.helper";
import { OutboundCallContext } from "../models/outboundCallContext";
import { CallRejectedHandler } from "./callRejectedHandler";

export class DialInputFailed{

    constructor(
        private readonly _context: OutboundCallContext,
        private readonly twiMLParser : TwiMLXMLParser,
        private readonly timeConversion : TimeConversion,
        private callRejectedHelper = new CallRejectedHandler(_context),
        private readonly webhookHelper = new WebhookUrlHelper()
    ){}

    userDialInputFailed(){

        this.getInstruction((response) => {

            if (this._context.callRejected){

                this.callRejectedHelper.reject(() => {
                });

                return;
            }

            this.parseInstruction(response);

            this.executeInstruction(() => {

                if (this._context.callRejected){

                    this.callRejectedHelper.reject(() => {
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

            this._context.callRejected = true;

            this._context.errMessage.push("No instructions found");

            callback();

            return;
        }

        let totalCount = dialplanInstructionList.length;

        this._context.Log(`Total instructions to be executed : ${totalCount}`);

        let instruction = dialplanInstructionList.shift();

        if (totalCount > 0){

            if (instruction.command === CommandConstants.exec){

                if (instruction.name === FreeswitchDpConstants.sleep){

                    let timeout = this.timeConversion.secondsToMS(Number(instruction.pauseAttribute.length));

                    connection.execute(instruction.name, timeout, () => {

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

        this.webhookHelper.triggerWebhook(this._context.webhookParam.actionUrl, 
            this._context.webhookParam.httpMethod, 
            this._context.outboundRequestParam, (response) => {

            if (response.Error){

                this._context.callRejected = true;

                this._context.legStop = true;

                this._context.errMessage.push(response.ErrorMessage);

                return callback();
            }
            else
            {
                callback(response.Data);
            }
        });
    }
    
    private parseInstruction(response:string){

        let parseInstruction = this.twiMLParser.tryParse(response);

        this._context.dpInstructions = parseInstruction;
    }
}