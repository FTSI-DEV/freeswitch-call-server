import axios from "axios";
import { connect } from "rxjs";
import { CommandConstants } from "src/helpers/constants/freeswitch-command.constants";
import { FreeswitchDpConstants } from "src/helpers/constants/freeswitchdp.constants";
import { TwiMLXMLParser } from "src/helpers/parser/xmlParser";
import { TimeConversion } from "src/utils/timeConversion.utils";
import { OutboundCallContext } from "../models/outboundCallContext";

export class DialEnd{
    
    constructor(
        private readonly _context: OutboundCallContext,
        private readonly twiMLParser : TwiMLXMLParser,
        private readonly timeConversion : TimeConversion
    ) {}

    dialEnd(){

        console.log('Dial End -> ');

        this.getInstruction((response) => {

            if (this._context.callRejected){
                this.callRejectedHandler(this._context, () => {

                });
                return;
            }

            console.log('Response Dial End -> ' , response);
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

    private callRejectedHandler(
        context:OutboundCallContext, 
        callback){
        let connection = context.connection;

        connection.execute('playback', 'ivr/ivr-call_cannot_be_completed_as_dialed.wav', () => {

            connection.execute('hangup', 'CALL_REJECTED', () => {
                context.callRejected = true;
                callback();
            });
        });
    }
}