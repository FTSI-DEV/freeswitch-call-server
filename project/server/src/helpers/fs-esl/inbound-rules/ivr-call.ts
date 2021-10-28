import { TwiMLXMLParser } from "src/helpers/parser/xmlParser";
import { WebhookUrlHelper } from "../webhookUrl.helper";
import { InboundCallContext } from "./models/inbound-call-context.model";

export class IvrCallHelper{

    constructor(
        private _context: InboundCallContext,
        private readonly _twiMLParser = new TwiMLXMLParser(_context.redisServer)
    ){}

    processedInstruction(callback){

        let context = this._context;

        this.getInstruction(context, (response) => {

        });

    }

    getInstruction(context:InboundCallContext, callback){

        context.serviceModel.webhookUrlHelper
        .triggerWebhook(
            context.webhookParam.actionUrl,
            context.webhookParam.httpMethod,
            context.inboundRequestParam,
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
        });
    }

}