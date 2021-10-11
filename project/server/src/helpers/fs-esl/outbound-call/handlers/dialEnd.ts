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

        console.log('Dial End -> ');

        this.getInstruction((response) => {

            if (this._context.callRejected){
                this.callRejectedHandler.reject(this._context, () => {

                });
                return;
            }

            console.log('Response Dial End -> ' , response);
        });
    }

    private getInstruction(callback){

        this.webhookHelper.triggerWebhook(this._context.webhookParam.actionUrl, 
            this._context.webhookParam.httpMethod, 
            this._context.requestParam, (response) => {

            if (response.Error){
                this._context.callRejected = true;
                this._context.legStop = true;
                console.log('Error: -> ', response.ErrorMessage);
                return callback();
            }
            else{
                callback(response.Data);
            }
        });
    }
}