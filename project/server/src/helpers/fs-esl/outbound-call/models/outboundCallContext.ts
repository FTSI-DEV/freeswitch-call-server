import { DialplanInstruction } from "src/helpers/parser/xmlParser";
import { CustomAppLogger } from "src/logger/customLogger";
import { WebhookParam } from "../../inbound-call/models/webhookParam";
import { OutboundCallServiceModel } from "./outboundCallServiceModel";
import { OutboundRequestParam } from "./outboundRequestParam.model";

export class OutboundCallContext{
    server:any;
    connection:any;
    serviceModel: OutboundCallServiceModel = new OutboundCallServiceModel();
    requestParam: OutboundRequestParam = new OutboundRequestParam();
    redisServer:any;
    legStop:boolean=false;
    logger:CustomAppLogger;
    legId:string;
    callRejected:boolean=false;
    dpInstructions:DialplanInstruction[] = [];
    twiMLResponse:string;
    webhookParam:WebhookParam = new WebhookParam();
    bridgeExecuted:boolean=false;
    channelState:ChannelStateModel = new ChannelStateModel();
    plagdNext:boolean=false;
    plagdStop:boolean=false;
    redirect:boolean=false;
    redisServerName:string="outbound_channelState";
    Log(message:string, error:boolean=false){
        let lmsg = `CallUid : ${this.legId} => ${message}`;

        if (error) this.logger.error(lmsg, new Error(message));
        else this.logger.info(lmsg);
    }
}

export class ChannelStateModel
{
    legId:string;
    answerState:string;
    channelState:string;
}

