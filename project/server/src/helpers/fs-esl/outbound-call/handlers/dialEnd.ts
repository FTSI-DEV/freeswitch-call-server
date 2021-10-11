import { WebhookUrlHelper } from "../../webhookUrl.helper";
import { OutboundCallContext } from "../models/outboundCallContext";
import { CallRejectedHandler } from "./callRejectedHandler";

export class DialEnd{
    
    constructor(
        private readonly _context: OutboundCallContext,
        private readonly callRejectedHandler = new CallRejectedHandler(_context),
        private readonly webhookHelper = new WebhookUrlHelper()
    ) {}

    dialEnd(){

        this.getInstruction((response) => {

            if (this._context.callRejected){

                this.callRejectedHandler.reject(() => {
                });
                
                return;
            }
            
        });
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
            else{
                callback(response.Data);
            }
        });
    }
}